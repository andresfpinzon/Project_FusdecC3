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
    public class EditionsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public EditionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Editions
        public async Task<IActionResult> Index()
        {
            var Editions = _context.Editions
                .Include(e => e.Course)
                .Include(e => e.EditionSchedules)
                    .ThenInclude(es => es.Schedule);
            return View(await Editions.ToListAsync());
        }

        // GET: Editions/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var edition = await _context.Editions
                .Include(e => e.Course)
                .Include(e => e.EditionSchedules)
                    .ThenInclude(es => es.Schedule)
                .FirstOrDefaultAsync(m => m.IdEdition == id);
            if (edition == null)
            {
                return NotFound();
            }

            return View(edition);
        }

        // GET: Editions/Create
        public IActionResult Create()
        {
            ViewBag.Schedules = _context.Schedules.ToList();
            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "IdCourse");
            return View();
        }

        // POST: Editions/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdEdition,EditionStartDate,EditionEndDate,IdCourse,Title,IdCourse,EditionStatus")] Edition edition, Guid[] selectedSchedules)
        {
            //if (ModelState.IsValid)
            {
                edition.IdEdition = Guid.NewGuid();
                _context.Add(edition);
                await _context.SaveChangesAsync();

                if (selectedSchedules != null && selectedSchedules.Length > 0)
                {
                    foreach (var scheduleId in selectedSchedules)
                    {
                        var editionSchedule = new EditionSchedule
                        {
                            IdEdition = edition.IdEdition,
                            IdSchedule = scheduleId
                        };
                        _context.EditionSchedules.Add(editionSchedule);
                    }
                    await _context.SaveChangesAsync();
                }

                return RedirectToAction(nameof(Index));
            }
            ViewBag.Schedules = _context.Schedules.ToList();
            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "IdCourse", edition.IdCourse);
            return View(edition);
        }

        // GET: Editions/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var edition = await _context.Editions
                .Include(e => e.EditionSchedules)
                    .ThenInclude(es => es.Schedule)
                .FirstOrDefaultAsync(e => e.IdEdition == id);
            if (edition == null)
            {
                return NotFound();
            }

            var schedules = await _context.Schedules.ToListAsync();
            ViewData["Schedules"] = new MultiSelectList(schedules, "IdSchedule", "ScheduleTitle", edition.EditionSchedules.Select(es => es.IdSchedule));

            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "IdCourse", edition.IdCourse);
            return View(edition);
        }

        // POST: Editions/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdEdition,EditionStartDate,EditionEndDate,IdCourse,Title,IdCourse,EditionStatus")] Edition edition, Guid[] selectedSchedules)
        {
            if (id != edition.IdEdition)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(edition);
                    // Eliminar los horarios antiguos
                    var existingSchedules = _context.EditionSchedules.Where(es => es.IdEdition == id);
                    _context.EditionSchedules.RemoveRange(existingSchedules);

                    // Agregar los nuevos horarios seleccionados
                    if (selectedSchedules != null)
                    {
                        foreach (var scheduleId in selectedSchedules)
                        {
                            _context.EditionSchedules.Add(new EditionSchedule { IdEdition = id, IdSchedule = scheduleId });
                        }
                    }

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EditionExists(edition.IdEdition))
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
            var schedules = await _context.Schedules.ToListAsync();
            ViewData["Schedules"] = new MultiSelectList(schedules, "IdSchedule", "ScheduleTitle", selectedSchedules);
            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "IdCourse", edition.IdCourse);
            return View(edition);
        }

        // GET: Editions/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var edition = await _context.Editions
                .Include(e => e.EditionSchedules)
                    .ThenInclude(es => es.Schedule)
                .FirstOrDefaultAsync(m => m.IdEdition == id);
            if (edition == null)
            {
                return NotFound();
            }

            return View(edition);
        }

        // POST: Editions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var edition = await _context.Editions.FindAsync(id);
            if (edition != null)
            {
                _context.Editions.Remove(edition);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EditionExists(Guid id)
        {
            return _context.Editions.Any(e => e.IdEdition == id);
        }
    }
}
