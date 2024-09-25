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
    [Authorize(Roles = "Administrador")]
    public class FundationsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public FundationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Fundations
        public async Task<IActionResult> Index()
        {
            return View(await _context.Fundations.ToListAsync());
        }

        // GET: Fundations/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var fundation = await _context.Fundations
                .FirstOrDefaultAsync(m => m.IdFundation == id);
            if (fundation == null)
            {
                return NotFound();
            }

            return View(fundation);
        }

        // GET: Fundations/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Fundations/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdFundation,FundationName")] Fundation fundation)
        {
            if (ModelState.IsValid)
            {
                fundation.IdFundation = Guid.NewGuid();
                _context.Add(fundation);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(fundation);
        }

        // GET: Fundations/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var fundation = await _context.Fundations.FindAsync(id);
            if (fundation == null)
            {
                return NotFound();
            }
            return View(fundation);
        }

        // POST: Fundations/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdFundation,FundationName")] Fundation fundation)
        {
            if (id != fundation.IdFundation)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(fundation);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FundationExists(fundation.IdFundation))
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
            return View(fundation);
        }

        // GET: Fundations/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var fundation = await _context.Fundations
                .FirstOrDefaultAsync(m => m.IdFundation == id);
            if (fundation == null)
            {
                return NotFound();
            }

            return View(fundation);
        }

        // POST: Fundations/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var fundation = await _context.Fundations.FindAsync(id);
            if (fundation != null)
            {
                _context.Fundations.Remove(fundation);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool FundationExists(Guid id)
        {
            return _context.Fundations.Any(e => e.IdFundation == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
