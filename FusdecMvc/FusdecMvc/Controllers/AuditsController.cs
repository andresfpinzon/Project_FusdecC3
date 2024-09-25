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
    //[Authorize(Roles = "Administrador")]
    public class AuditsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AuditsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Audits
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Audits.Include(a => a.Certificate);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: Audits/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var audit = await _context.Audits
                .Include(a => a.Certificate)
                .FirstOrDefaultAsync(m => m.IdAudit == id);
            if (audit == null)
            {
                return NotFound();
            }

            return View(audit);
        }

        // GET: Audits/Create
        public IActionResult Create()
        {
            ViewData["IdCertificate"] = new SelectList(_context.Certificate, "IdCertificate", "IdCertificate");
            return View();
        }

        // POST: Audits/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdAudit,AuditDate,NameOfIssuerAudit,IdCertificate")] Audit audit)
        {
            //if (ModelState.IsValid)
            {
                audit.IdAudit = Guid.NewGuid();
                _context.Add(audit);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IdCertificate"] = new SelectList(_context.Certificate, "IdCertificate", "IdCertificate", audit.IdCertificate);
            return View(audit);
        }

        // GET: Audits/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var audit = await _context.Audits.FindAsync(id);
            if (audit == null)
            {
                return NotFound();
            }
            ViewData["IdCertificate"] = new SelectList(_context.Certificate, "IdCertificate", "IdCertificate", audit.IdCertificate);
            return View(audit);
        }

        // POST: Audits/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdAudit,AuditDate,NameOfIssuerAudit,IdCertificate")] Audit audit)
        {
            if (id != audit.IdAudit)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(audit);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AuditExists(audit.IdAudit))
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
            ViewData["IdCertificate"] = new SelectList(_context.Certificate, "IdCertificate", "IdCertificate", audit.IdCertificate);
            return View(audit);
        }

        // GET: Audits/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var audit = await _context.Audits
                .Include(a => a.Certificate)
                .FirstOrDefaultAsync(m => m.IdAudit == id);
            if (audit == null)
            {
                return NotFound();
            }

            return View(audit);
        }

        // POST: Audits/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var audit = await _context.Audits.FindAsync(id);
            if (audit != null)
            {
                _context.Audits.Remove(audit);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AuditExists(Guid id)
        {
            return _context.Audits.Any(e => e.IdAudit == id);
        }

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
