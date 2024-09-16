using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using FusdecMvc.Data;
using FusdecMvc.Models;

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
            var applicationDbContext = _context.NonAttendances.Include(n => n.Attendance).Include(n => n.Report);
            return View(await applicationDbContext.ToListAsync());
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
                .Include(n => n.Report)
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
            ViewData["IdReport"] = new SelectList(_context.Reports, "IdReport", "Observation");
            return View();
        }

        // POST: NonAttendances/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdNonAttendance,IdAttendance,IdReport")] NonAttendance nonAttendance)
        {
            if (ModelState.IsValid)
            {
                nonAttendance.IdNonAttendance = Guid.NewGuid();
                _context.Add(nonAttendance);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "IdAttendance", nonAttendance.IdAttendance);
            ViewData["IdReport"] = new SelectList(_context.Reports, "IdReport", "IdReport", nonAttendance.IdReport);
            return View(nonAttendance);
        }

        // GET: NonAttendances/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nonAttendance = await _context.NonAttendances.FindAsync(id);
            if (nonAttendance == null)
            {
                return NotFound();
            }
            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "AttendanceDate", nonAttendance.IdAttendance);
            ViewData["IdReport"] = new SelectList(_context.Reports, "IdReport", "Observation", nonAttendance.IdReport);
            return View(nonAttendance);
        }

        // POST: NonAttendances/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdNonAttendance,IdAttendance,IdReport")] NonAttendance nonAttendance)
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
            ViewData["IdAttendance"] = new SelectList(_context.Attendances, "IdAttendance", "IdAttendance", nonAttendance.IdAttendance);
            ViewData["IdReport"] = new SelectList(_context.Reports, "IdReport", "IdReport", nonAttendance.IdReport);
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
                .Include(n => n.Report)
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
    }
}
