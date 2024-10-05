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
using Microsoft.AspNetCore.Identity;

namespace FusdecMvc.Controllers
{
    [Authorize(Roles = "Administrador")]
    public class UnitsController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UnitsController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Units
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Units
                .Include(u => u.Brigade)
                .Include(u => u.User);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: Units/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var unit = await _context.Units
                .Include(u => u.Brigade)
                .FirstOrDefaultAsync(m => m.IdUnit == id);
            if (unit == null)
            {
                return NotFound();
            }

            return View(unit);
        }

        // GET: Units/Create
        public async Task<IActionResult> Create()
        {
            // Obtener los usuarios que tienen el rol "Instructor"
            var instructors = await _userManager.GetUsersInRoleAsync("Instructor");

            // Pasar la lista de usuarios a la vista
            ViewData["UserId"] = new SelectList(instructors, "Id", "Email");
            ViewData["IdBrigade"] = new SelectList(_context.Brigade, "IdBrigade", "BrigadeName");
            return View();
        }

        // POST: Units/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdUnit,UnitName,UnitState,IdBrigade,UserId")] Unit unit)
        {
            //if (ModelState.IsValid)
            {
                unit.IdUnit = Guid.NewGuid();
                _context.Add(unit);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["UserId"] = new SelectList(_context.Users, "Id", "Email");
            ViewData["IdBrigade"] = new SelectList(_context.Brigade, "IdBrigade", "IdBrigade", unit.IdBrigade);
            return View(unit);
        }

        // GET: Units/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var unit = await _context.Units.FindAsync(id);
            if (unit == null)
            {
                return NotFound();
            }
            // Obtener los usuarios que tienen el rol "Instructor"
            var instructors = await _userManager.GetUsersInRoleAsync("Instructor");

            // Pasar la lista de usuarios a la vista
            ViewData["UserId"] = new SelectList(instructors, "Id", "Email");
            ViewData["IdBrigade"] = new SelectList(_context.Brigade, "IdBrigade", "BrigadeName", unit.IdBrigade);
            return View(unit);
        }

        // POST: Units/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdUnit,UnitName,UnitState,IdBrigade,UserId")] Unit unit)
        {
            if (id != unit.IdUnit)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(unit);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UnitExists(unit.IdUnit))
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
            ViewData["IdBrigade"] = new SelectList(_context.Brigade, "IdBrigade", "IdBrigade", unit.IdBrigade);
            return View(unit);
        }

        // GET: Units/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var unit = await _context.Units
                .Include(u => u.Brigade)
                .FirstOrDefaultAsync(m => m.IdUnit == id);
            if (unit == null)
            {
                return NotFound();
            }

            return View(unit);
        }

        // POST: Units/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit != null)
            {
                _context.Units.Remove(unit);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UnitExists(Guid id)
        {
            return _context.Units.Any(e => e.IdUnit == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }

    }
}
