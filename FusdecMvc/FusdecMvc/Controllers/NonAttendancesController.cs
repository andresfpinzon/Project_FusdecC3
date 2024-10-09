using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using FusdecMvc.Data;
using FusdecMvc.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace FusdecMvc.Controllers
{
    public class NonAttendancesController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public NonAttendancesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: NonAttendances
        [Authorize(Roles = "Instructor, Administrador")]
        public async Task<IActionResult> Index()
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Verificar si el usuario es un Instructor
            if (User.IsInRole("Instructor"))
            {
                // Filtrar las asistencias por las realizadas por el instructor actual
                var NonAttendances = _context.NonAttendances
                    .Include(n => n.Attendance)
                    .Include(e => e.StudentNonAttendance)
                        .ThenInclude(es => es.Student)
                    .Where(a => a.UserId == currentUser.Id);

                return View(await NonAttendances.ToListAsync());
            }

            return View(await _context.NonAttendances
                .Include(n => n.Attendance)
                .Include(e => e.StudentNonAttendance)
                    .ThenInclude(es => es.Student)
                .ToListAsync());
        }

        // GET: NonAttendances/Details/5
        [Authorize(Roles = "Instructor, Administrador")]
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nonAttendance = await _context.NonAttendances
                .Include(n => n.Attendance)
                .Include(e => e.StudentNonAttendance)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(m => m.IdNonAttendance == id);
            if (nonAttendance == null)
            {
                return NotFound();
            }

            return View(nonAttendance);
        }

        // GET: NonAttendances/Create
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Create()
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Filtrar las unidades asociadas al instructor (usuario logeado)
            var units = await _context.Units
                .Where(u => u.UserId == currentUser.Id)
                .ToListAsync();

            // Obtener los estudiantes que pertenecen a esas unidades
            var students = await _context.Students
                .Include(s => s.Unit)
                .Where(s => units.Select(u => u.IdUnit).Contains(s.IdUnit))
                .ToListAsync();

            // Obtener las asistencias solo del instructor logeado
            var attendances = await _context.Attendances
                .Where(a => a.UserId == currentUser.Id)
                .ToListAsync();

            // Configurar los datos para la vista
            ViewData["IdAttendance"] = new SelectList(attendances, "IdAttendance", "AttendanceTitle");
            ViewBag.Students = students;

            // Extraer las unidades distintas del instructor
            var distinctUnits = students.Select(s => s.Unit).Distinct().ToList();
            ViewBag.Units = distinctUnits;

            // Si tiene múltiples unidades, seleccionar la primera por defecto
            ViewBag.SelectedUnit = distinctUnits.FirstOrDefault()?.UnitName;

            return View();
        }

        // POST: NonAttendances/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Create([Bind("IdNonAttendance,IdAttendance,NonAttendanceTitle,Observacion,UserId")] NonAttendance nonAttendance, Guid[] selectedStudents)
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Asignar el Id del usuario actual como el UserId del instructor
            nonAttendance.UserId = currentUser.Id;
            //if (ModelState.IsValid)
            {
                nonAttendance.IdNonAttendance = Guid.NewGuid();
                _context.Add(nonAttendance);
                await _context.SaveChangesAsync();
                if (selectedStudents != null && selectedStudents.Length > 0)
                {
                    foreach (var studentId in selectedStudents)
                    {
                        var studentNonAttendance = new StudentNonAttendance
                        {
                            IdNonAttendance = nonAttendance.IdNonAttendance,
                            IdStudent = studentId
                        };
                        _context.StudentNonAttendances.Add(studentNonAttendance);
                    }
                    await _context.SaveChangesAsync();
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "IdAttendance", nonAttendance.IdAttendance);
            ViewBag.Students = _context.Students.ToList();
            return View(nonAttendance);
        }

        // GET: NonAttendances/Edit/5
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nonAttendance = await _context.NonAttendances
                .Include(e => e.StudentNonAttendance)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(a => a.IdNonAttendance == id);
            if (nonAttendance == null)
            {
                return NotFound();
            }
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Filtrar las unidades asociadas al instructor (usuario logeado)
            var units = await _context.Units
                .Where(u => u.UserId == currentUser.Id)
                .ToListAsync();

            // Obtener los estudiantes que pertenecen a esas unidades
            var students = await _context.Students
                .Include(s => s.Unit)
                .Where(s => units.Select(u => u.IdUnit).Contains(s.IdUnit))
                .ToListAsync();

            // Configurar los datos para la vista
            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "AttendanceTitle", nonAttendance.IdAttendance);
            ViewBag.Students = students;
            
            // Extraer las unidades distintas del instructor
            var distinctUnits = students.Select(s => s.Unit).Distinct().ToList();
            ViewBag.Units = distinctUnits;

            // Si hay varias unidades, seleccionar la primera por defecto
            ViewBag.SelectedUnit = distinctUnits.FirstOrDefault()?.UnitName;
           
            // Obtener los IDs de los estudiantes seleccionados en la no asistencia
            ViewBag.SelectedStudents = nonAttendance.StudentNonAttendance.Select(ea => ea.IdStudent).ToList();

            return View(nonAttendance);
        }

        // POST: NonAttendances/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdNonAttendance,IdAttendance,NonAttendanceTitle,Observacion,UserId")] NonAttendance nonAttendance, Guid[] selectedStudents)
        {
            if (id != nonAttendance.IdNonAttendance)
            {
                return NotFound();
            }
            // Obtener la inasistencia actual de la base de datos para mantener el UserId original
            var existingNonAttendance = await _context.NonAttendances.AsNoTracking().FirstOrDefaultAsync(a => a.IdNonAttendance == id);

            if (existingNonAttendance == null)
            {
                return NotFound();
            }

            // Mantener el UserId original
            nonAttendance.UserId = existingNonAttendance.UserId;

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(nonAttendance);

                    var existingStudents = _context.StudentNonAttendances.Where(es => es.IdNonAttendance == id);
                    _context.StudentNonAttendances.RemoveRange(existingStudents);

                    if (selectedStudents != null)
                    {
                        foreach (var studentId in selectedStudents)
                        {
                            _context.StudentNonAttendances.Add(new StudentNonAttendance { IdNonAttendance = id, IdStudent = studentId });
                        }
                    }

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!NonAttendanceExists(nonAttendance.IdNonAttendance))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            var students = await _context.Students.ToListAsync();
            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "IdAttendance", nonAttendance.IdAttendance);
            return View(nonAttendance);
        }

        // GET: NonAttendances/Delete/5
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nonAttendance = await _context.NonAttendances
                .Include(n => n.Attendance)
                .Include(e => e.StudentNonAttendance)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(m => m.IdNonAttendance == id);
            if (nonAttendance == null)
            {
                return NotFound();
            }

            return View(nonAttendance);
        }

        // POST: NonAttendances/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var nonAttendance = await _context.NonAttendances.FindAsync(id);
            if (nonAttendance != null)
            {
                _context.NonAttendances.Remove(nonAttendance);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool NonAttendanceExists(Guid id)
        {
            return _context.NonAttendances.Any(e => e.IdNonAttendance == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
