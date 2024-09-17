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

namespace FusdecMvc.Controllers
{
    public class AttendancesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AttendancesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Attendances
        public async Task<IActionResult> Index()
        {
            return View(await _context.Attendances
                .Include(e => e.StudentAttendances)
                    .ThenInclude(es => es.Student)
                .ToListAsync());
        }

        // GET: Attendances/Details/5
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
        public IActionResult Create()
        {
            return View();
        }

        // POST: Attendances/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdAttendance,AttendanceDate,AttendanceStatus")] Attendance attendance, Guid[] selectedStudents)
        {
            //if (ModelState.IsValid)
            {
                attendance.IdAttendance = Guid.NewGuid();
                _context.Add(attendance);
                await _context.SaveChangesAsync();
                if (selectedStudents != null && selectedStudents.Length > 0)
                {
                    foreach (var studentId in selectedStudents)
                    {
                        var studentAttendance= new StudentAttendance
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
            var students = await _context.Students.ToListAsync();
            ViewData["Students"] = new MultiSelectList(students, "IdStudent", "DocumentNumber", attendance.StudentAttendances.Select(ea => ea.IdStudent));
            return View(attendance);
        }

        // POST: Attendances/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("AttendanceTitle,IdAttendance,AttendanceDate,AttendanceStatus")] Attendance attendance, Guid[] selectedStudents)
        {
            if (id != attendance.IdAttendance)
            {
                return NotFound();
            }

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
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var attendance = await _context.Attendances
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
