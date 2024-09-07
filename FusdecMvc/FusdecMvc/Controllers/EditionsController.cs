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
            return View(await _context.Editions.ToListAsync());
        }

        // GET: Editions/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var edition = await _context.Editions
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
            return View();
        }

        // POST: Editions/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdEdition,EditionStartDate,EditionEndDate,IdCourse")] Edition edition)
        {
            if (ModelState.IsValid)
            {
                edition.IdEdition = Guid.NewGuid();
                _context.Add(edition);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(edition);
        }

        // GET: Editions/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var edition = await _context.Editions.FindAsync(id);
            if (edition == null)
            {
                return NotFound();
            }
            return View(edition);
        }

        // POST: Editions/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdEdition,EditionStartDate,EditionEndDate,IdCourse")] Edition edition)
        {
            if (id != edition.IdEdition)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(edition);
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
