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

namespace FusdecMvc.Controllers
{
    public class GradesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public GradesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Grades
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Grades
                .Include(g => g.StudentGrade)
                    .ThenInclude(es => es.Student);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: Grades/Details/5
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
        public IActionResult Create()
        {
            ViewBag.Students = _context.Students.Include(s => s.Unit).ToList();
            return View();
        }

        // POST: Grades/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdGrade,GradeTitle,Approved,ObservationGrade")] Grade grade, Guid[] selectedStudents)
        {
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

            // Retrieve the students, including their related Units
            var students = await _context.Students
                .Include(s => s.Unit)  // Include the Unit relationship
                .ToListAsync();


            ViewBag.Students = students;
            ViewBag.SelectedStudents = grade.StudentGrade.Select(eg => eg.IdStudent).ToList();
            return View(grade);
        }

        // POST: Grades/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdGrade,IdReport,GradeTitle,Approved,ObservationGrade")] Grade grade, Guid[] selectedStudents)
        {
            if (id != grade.IdGrade)
            {
                return NotFound();
            }

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
