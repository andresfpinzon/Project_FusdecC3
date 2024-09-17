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
    public class BrigadesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BrigadesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Brigades
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Brigade.Include(b => b.Command);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: Brigades/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var brigade = await _context.Brigade
                .Include(b => b.Command)
                .FirstOrDefaultAsync(m => m.IdBrigade == id);
            if (brigade == null)
            {
                return NotFound();
            }

            return View(brigade);
        }

        // GET: Brigades/Create
        public IActionResult Create()
        {
            ViewData["IdCommand"] = new SelectList(_context.Commands, "IdCommand", "CommandName");
            return View();
        }

        // POST: Brigades/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdBrigade,BrigadeName,BrigadeLocation,BrigadeStatus,IdCommand")] Brigade brigade)
        {
            //if (ModelState.IsValid)
            {
                brigade.IdBrigade = Guid.NewGuid();
                _context.Add(brigade);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IdCommand"] = new SelectList(_context.Commands, "IdCommand", "IdCommand", brigade.IdCommand);
            return View(brigade);
        }

        // GET: Brigades/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var brigade = await _context.Brigade.FindAsync(id);
            if (brigade == null)
            {
                return NotFound();
            }
            ViewData["IdCommand"] = new SelectList(_context.Commands, "IdCommand", "CommandName", brigade.IdCommand);
            return View(brigade);
        }

        // POST: Brigades/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdBrigade,BrigadeName,BrigadeLocation,BrigadeStatus,IdCommand")] Brigade brigade)
        {
            if (id != brigade.IdBrigade)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(brigade);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BrigadeExists(brigade.IdBrigade))
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
            ViewData["IdCommand"] = new SelectList(_context.Commands, "IdCommand", "IdCommand", brigade.IdCommand);
            return View(brigade);
        }

        // GET: Brigades/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var brigade = await _context.Brigade
                .Include(b => b.Command)
                .FirstOrDefaultAsync(m => m.IdBrigade == id);
            if (brigade == null)
            {
                return NotFound();
            }

            return View(brigade);
        }

        // POST: Brigades/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var brigade = await _context.Brigade.FindAsync(id);
            if (brigade != null)
            {
                _context.Brigade.Remove(brigade);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool BrigadeExists(Guid id)
        {
            return _context.Brigade.Any(e => e.IdBrigade == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
