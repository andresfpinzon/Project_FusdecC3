 using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FusdecMvc.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using FusdecMvc.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FusdecMvc.Controllers
{
    public class CertificatesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CertificatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Certificates
        public async Task<IActionResult> Index()
        {
            var certificates = await _context.Certificate
                .Include(c => c.Student)
                .Include(c => c.Course)
                .ToListAsync();
            return View(certificates);
        }

        // GET: Certificates/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var certificate = await _context.Certificate
                .Include(c => c.Student)
                .Include(c => c.Course)
                .FirstOrDefaultAsync(m => m.IdCertificate == id);

            if (certificate == null)
            {
                return NotFound();
            }

            return View(certificate);
        }

        // GET: Certificates/Create
        public IActionResult Create()
        {
            ViewData["IdStudent"] = new SelectList(_context.Students, "IdStudent", "IdStudent");
            ViewData["IdCourse"] = new SelectList(_context.Students, "IdCourse", "IdCourse");
            return View();
        }

        // POST: Certificates/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("VerificationCode,NameOfIssuerCert,CertificateStatus,IdStudent,IdCourse")] Certificate certificate)
        {
            //if (ModelState.IsValid)
            {
                certificate.IdCertificate = Guid.NewGuid();
                _context.Add(certificate);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IdStudent"] = new SelectList(_context.Students, "IdStudent", "IdStudent");
            ViewData["IdCourse"] = new SelectList(_context.Students, "IdCourse", "IdCourse");
            return View(certificate);
        }

        // GET: Certificates/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var certificate = await _context.Certificate.FindAsync(id);
            if (certificate == null)
            {
                return NotFound();
            }
            ViewData["IdStudent"] = new SelectList(_context.Students, "IdStudent", "IdStudent");
            ViewData["IdCourse"] = new SelectList(_context.Students, "IdCourse", "IdCourse");
            return View(certificate);
        }

        // POST: Certificates/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdCertificate,VerificationCode,NameOfIssuerCert,CertificateStatus,IdStudent,IdCourse")] Certificate certificate)
        {
            if (id != certificate.IdCertificate)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(certificate);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CertificateExists(certificate.IdCertificate))
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
            ViewData["IdStudent"] = new SelectList(_context.Students, "IdStudent", "IdStudent");
            ViewData["IdCourse"] = new SelectList(_context.Students, "IdCourse", "IdCourse");
            return View(certificate);
        }

        // GET: Certificates/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var certificate = await _context.Certificate
                .Include(c => c.Student)
                .Include(c => c.Course)
                .FirstOrDefaultAsync(m => m.IdCertificate == id);

            if (certificate == null)
            {
                return NotFound();
            }

            return View(certificate);
        }

        // POST: Certificates/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var certificate = await _context.Certificate.FindAsync(id);
            _context.Certificate.Remove(certificate);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CertificateExists(Guid id)
        {
            return _context.Certificate.Any(e => e.IdCertificate == id);
        }
    }
}
