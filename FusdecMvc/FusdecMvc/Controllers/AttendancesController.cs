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
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;

namespace FusdecMvc.Controllers
{
    public class AttendancesController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public AttendancesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Attendances
        [Authorize(Roles = "Instructor, Administrador")]
        public async Task<IActionResult> Index()
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Verificar si el usuario es un Instructor
            if (User.IsInRole("Instructor"))
            {
                // Filtrar las asistencias por las realizadas por el instructor actual
                var attendances = _context.Attendances
                    .Include(e => e.StudentAttendances)
                        .ThenInclude(es => es.Student)
                    .Where(a => a.UserId == currentUser.Id);

                return View(await attendances.ToListAsync());
            }


            var allAttendances = _context.Attendances
                .Include(e => e.StudentAttendances)
                    .ThenInclude(es => es.Student);

            return View(await allAttendances.ToListAsync());
        }

        // GET: Attendances/Details/5
        [Authorize(Roles = "Instructor, Administrador")]
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var attendance = await _context.Attendances
                .Include(e => e.StudentAttendances)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(m => m.IdAttendance == id);
            if (attendance == null)
            {
                return NotFound();
            }

            return View(attendance);
        }

        // GET: Attendances/Create
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Create()
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Filtrar los estudiantes por las unidades asociadas al instructor (usuario logeado)
            var students = _context.Students
                                   .Include(s => s.Unit)
                                   .Where(s => s.Unit.UserId == currentUser.Id) // Asegúrate de tener una relación entre unidad e instructor
                                   .ToList();

            ViewBag.Students = students;

            // Extraer las unidades distintas del instructor
            var distinctUnits = students.Select(s => s.Unit).Distinct().ToList();
            ViewBag.Units = distinctUnits;

            // Si tiene múltiples unidades, seleccionar la primera por defecto
            ViewBag.SelectedUnit = distinctUnits.FirstOrDefault()?.UnitName;

            return View();
        }

        // POST: Attendances/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Create([Bind("IdAttendance,AttendanceTitle,IdAttendance,AttendanceDate,UserId")] Attendance attendance, Guid[] selectedStudents)
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Asignar el Id del usuario actual como el UserId del instructor
            attendance.UserId = currentUser.Id;

            //if (ModelState.IsValid)
            {
                attendance.IdAttendance = Guid.NewGuid();
                _context.Add(attendance);
                await _context.SaveChangesAsync();
                if (selectedStudents != null && selectedStudents.Length > 0)
                {
                    foreach (var studentId in selectedStudents)
                    {
                        var studentAttendance = new StudentAttendance
                        {
                            IdAttendance = attendance.IdAttendance,
                            IdStudent = studentId
                        };
                        _context.StudentAttendances.Add(studentAttendance);
                    }
                    await _context.SaveChangesAsync();
                }
                return RedirectToAction(nameof(Index));
            }
            ViewBag.Students = _context.Students.ToList();
            return View(attendance);
        }

        // GET: Attendances/Edit/5
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var attendance = await _context.Attendances
                .Include(e => e.StudentAttendances)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(a => a.IdAttendance == id);
            if (attendance == null)
            {
                return NotFound();
            }

            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Filtrar los estudiantes por las unidades asociadas al instructor
            var students = await _context.Students
                                         .Include(s => s.Unit)
                                         .Where(s => s.Unit.UserId == currentUser.Id) // Filtrar por el instructor
                                         .ToListAsync();

            ViewBag.Students = students;
            ViewBag.SelectedStudents = attendance.StudentAttendances.Select(ea => ea.IdStudent).ToList();

            // Extraer las unidades distintas del instructor
            var distinctUnits = students.Select(s => s.Unit).Distinct().ToList();
            ViewBag.Units = distinctUnits;

            // Si hay varias unidades, seleccionar la primera por defecto
            ViewBag.SelectedUnit = distinctUnits.FirstOrDefault()?.UnitName;

            return View(attendance);
        }


        // POST: Attendances/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Edit(Guid id, [Bind("AttendanceTitle,IdAttendance,AttendanceDate,UserId")] Attendance attendance, Guid[] selectedStudents)
        {
            if (id != attendance.IdAttendance)
            {
                return NotFound();
            }

            // Obtener la asistencia actual de la base de datos para mantener el UserId original
            var existingAttendance = await _context.Attendances.AsNoTracking().FirstOrDefaultAsync(a => a.IdAttendance == id);

            if (existingAttendance == null)
            {
                return NotFound();
            }

            // Mantener el UserId original
            attendance.UserId = existingAttendance.UserId;

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(attendance);
                    // Eliminar los horarios antiguos
                    var existingStudents = _context.StudentAttendances.Where(es => es.IdAttendance == id);
                    _context.StudentAttendances.RemoveRange(existingStudents);

                    // Agregar los nuevos horarios seleccionados
                    if (selectedStudents != null)
                    {
                        foreach (var studentId in selectedStudents)
                        {
                            _context.StudentAttendances.Add(new StudentAttendance { IdAttendance = id, IdStudent = studentId });
                        }
                    }
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AttendanceExists(attendance.IdAttendance))
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
            ViewData["Students"] = new MultiSelectList(students, "IdSchedule", "ScheduleTitle", selectedStudents);
            return View(attendance);
        }

        // GET: Attendances/Delete/5
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var attendance = await _context.Attendances
                .Include(e => e.StudentAttendances)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(m => m.IdAttendance == id);
            if (attendance == null)
            {
                return NotFound();
            }

            return View(attendance);
        }

        // POST: Attendances/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance != null)
            {
                _context.Attendances.Remove(attendance);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AttendanceExists(Guid id)
        {
            return _context.Attendances.Any(e => e.IdAttendance == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
