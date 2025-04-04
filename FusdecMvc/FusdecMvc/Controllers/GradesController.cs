﻿using System;
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

namespace FusdecMvc.Controllers
{
    public class GradesController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public GradesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Grades
        [Authorize(Roles = "Instructor, Administrador")]
        public async Task<IActionResult> Index()
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Verificar si el usuario es un Instructor
            if (User.IsInRole("Instructor"))
            {
                // Filtrar las asistencias por las realizadas por el instructor actual
                var grades = _context.Grades
                .Include(g => g.StudentGrade)
                    .ThenInclude(es => es.Student)
                    .Where(a => a.UserId == currentUser.Id);

                return View(await grades.ToListAsync());
            }
            var allGrades = _context.Grades
                .Include(g => g.StudentGrade)
                    .ThenInclude(es => es.Student);
            return View(await allGrades.ToListAsync());
        }

        // GET: Grades/Details/5
        [Authorize(Roles = "Instructor, Administrador")]
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var grade = await _context.Grades
                 .Include(g => g.StudentGrade)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(m => m.IdGrade == id);
            if (grade == null)
            {
                return NotFound();
            }

            return View(grade);
        }

        // GET: Grades/Create
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

        // POST: Grades/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Create([Bind("IdGrade,GradeTitle,Approved,ObservationGrade,UserId")] Grade grade, Guid[] selectedStudents)
        {
            // Obtener el usuario actual
            var currentUser = await _userManager.GetUserAsync(User);

            // Asignar el Id del usuario actual como el UserId del instructor
            grade.UserId = currentUser.Id;

            //if (ModelState.IsValid)
            {
                grade.IdGrade = Guid.NewGuid();
                _context.Add(grade);
                await _context.SaveChangesAsync();
                if (selectedStudents != null && selectedStudents.Length > 0)
                {
                    foreach (var studentId in selectedStudents)
                    {
                        var studentGrade = new StudentGrade
                        {
                            IdGrade = grade.IdGrade,
                            IdStudent = studentId
                        };
                        _context.StudentGrades.Add(studentGrade);
                    }
                    await _context.SaveChangesAsync();
                }
                return RedirectToAction(nameof(Index));
            }
            ViewBag.Students = _context.Students.ToList();
            return View(grade);
        }

        // GET: Grades/Edit/5
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var grade = await _context.Grades
                 .Include(g => g.StudentGrade)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(a => a.IdGrade == id);
            if (grade == null)
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
            ViewBag.SelectedStudents = grade.StudentGrade.Select(ea => ea.IdStudent).ToList();

            // Extraer las unidades distintas del instructor
            var distinctUnits = students.Select(s => s.Unit).Distinct().ToList();
            ViewBag.Units = distinctUnits;

            // Si hay varias unidades, seleccionar la primera por defecto
            ViewBag.SelectedUnit = distinctUnits.FirstOrDefault()?.UnitName;
            return View(grade);
        }

        // POST: Grades/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdGrade,IdReport,GradeTitle,Approved,ObservationGrade")] Grade grade, Guid[] selectedStudents)
        {
            if (id != grade.IdGrade)
            {
                return NotFound();
            }

            // Obtener la asistencia actual de la base de datos para mantener el UserId original
            var existingGrade = await _context.Grades.AsNoTracking().FirstOrDefaultAsync(a => a.IdGrade == id);

            if (existingGrade == null)
            {
                return NotFound();
            }

            // Mantener el UserId original
            grade.UserId = existingGrade.UserId;

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(grade);
                    // Eliminar los horarios antiguos
                    var existingStudents = _context.StudentGrades.Where(es => es.IdGrade == id);
                    _context.StudentGrades.RemoveRange(existingStudents);
                    // Agregar los nuevos horarios seleccionados
                    if (selectedStudents != null)
                    {
                        foreach (var studentId in selectedStudents)
                        {
                            _context.StudentGrades.Add(new StudentGrade { IdGrade = id, IdStudent = studentId });
                        }
                    }
                    await _context.SaveChangesAsync();

                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GradeExists(grade.IdGrade))
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
            return View(grade);
        }

        // GET: Grades/Delete/5
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var grade = await _context.Grades
                 .Include(g => g.StudentGrade)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(m => m.IdGrade == id);
            if (grade == null)
            {
                return NotFound();
            }

            return View(grade);
        }

        // POST: Grades/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade != null)
            {
                _context.Grades.Remove(grade);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool GradeExists(Guid id)
        {
            return _context.Grades.Any(e => e.IdGrade == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
