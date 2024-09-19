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
    public class NonAttendancesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public NonAttendancesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: NonAttendances
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.NonAttendances.Include(n => n.Attendance);
            return View(await _context.NonAttendances
                .Include(e => e.StudentNonAttendance)
                    .ThenInclude(es => es.Student)
                .ToListAsync());
        }

        // GET: NonAttendances/Details/5
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
        public IActionResult Create()
        {
            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "AttendanceDate");
            ViewBag.Students = _context.Students.Include(s => s.Unit).ToList();
            return View();
        }

        // POST: NonAttendances/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdNonAttendance,IdAttendance,IdReport")] NonAttendance nonAttendance, Guid[] selectedStudents)
        {
            if (ModelState.IsValid)
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
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nonAttendance = await _context.NonAttendances
                .Include(e => e.StudentNonAttendance)
                    .ThenInclude(es => es.Student)
                .FirstOrDefaultAsync(a => a.IdAttendance == id);
            if (nonAttendance == null)
            {
                return NotFound();
            }
            var students = await _context.Students
                .Include(s => s.Unit)
                .ToListAsync();

            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "AttendanceDate", nonAttendance.IdAttendance);
            ViewBag.Students = students;
            ViewBag.SelectedStudents = nonAttendance.StudentNonAttendance.Select(ea => ea.IdStudent).ToList();
            return View(nonAttendance);
        }

        // POST: NonAttendances/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdNonAttendance,IdAttendance,IdReport")] NonAttendance nonAttendance, Guid[] selectedStudents)
        {
            if (id != nonAttendance.IdNonAttendance)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
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
