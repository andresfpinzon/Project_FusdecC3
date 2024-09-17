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
    public class CommandsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CommandsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Commands
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Commands.Include(c => c.Fundation);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: Commands/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var command = await _context.Commands
                .Include(c => c.Fundation)
                .FirstOrDefaultAsync(m => m.IdCommand == id);
            if (command == null)
            {
                return NotFound();
            }

            return View(command);
        }

        // GET: Commands/Create
        public IActionResult Create()
        {
            ViewData["IdFundation"] = new SelectList(_context.Fundations, "IdFundation", "FundationName");
            return View();
        }

        // POST: Commands/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdCommand,CommandName,CommandStatus,UbicacionComando,IdFundation")] Command command)
        {
            //if (ModelState.IsValid)
            {
                command.IdCommand = Guid.NewGuid();
                _context.Add(command);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IdFundation"] = new SelectList(_context.Fundations, "IdFundation", "IdFundation", command.IdFundation);
            return View(command);
        }

        // GET: Commands/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var command = await _context.Commands.FindAsync(id);
            if (command == null)
            {
                return NotFound();
            }
            ViewData["IdFundation"] = new SelectList(_context.Fundations, "IdFundation", "FundationName", command.IdFundation);
            return View(command);
        }

        // POST: Commands/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdCommand,CommandName,CommandStatus,UbicacionComando,IdFundation")] Command command)
        {
            if (id != command.IdCommand)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(command);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CommandExists(command.IdCommand))
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
            ViewData["IdFundation"] = new SelectList(_context.Fundations, "IdFundation", "IdFundation", command.IdFundation);
            return View(command);
        }

        // GET: Commands/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var command = await _context.Commands
                .Include(c => c.Fundation)
                .FirstOrDefaultAsync(m => m.IdCommand == id);
            if (command == null)
            {
                return NotFound();
            }

            return View(command);
        }

        // POST: Commands/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var command = await _context.Commands.FindAsync(id);
            if (command != null)
            {
                _context.Commands.Remove(command);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CommandExists(Guid id)
        {
            return _context.Commands.Any(e => e.IdCommand == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
