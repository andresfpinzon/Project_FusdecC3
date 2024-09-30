 using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FusdecMvc.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using FusdecMvc.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;

namespace FusdecMvc.Controllers
{
    [Authorize(Roles = "Administrador")]
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
            ViewBag.Students = _context.Students.ToList();
            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "CourseName");
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
                certificate.VerificationCode = GenerateVerificationCode();

                _context.Add(certificate);
                await _context.SaveChangesAsync();

                var audit = new Audit
                {
                    IdAudit = Guid.NewGuid(),
                    AuditDate = DateOnly.FromDateTime(DateTime.Now), 
                    NameOfIssuerAudit = certificate.NameOfIssuerCert, 
                    IdCertificate = certificate.IdCertificate 
                };

                _context.Add(audit);
                await _context.SaveChangesAsync();

                return RedirectToAction(nameof(Index));
            }
            ViewBag.Students = _context.Students.ToList();
            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "CourseName");
            return View(certificate);
        }

        private string GenerateVerificationCode()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var result = new string(
                Enumerable.Repeat(chars, 20) 
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());
            return result;
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
            ViewBag.Students = _context.Students.ToList();
            ViewBag.SelectedStudentId = certificate.IdStudent;
            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "CourseName");
            return View(certificate);
        }

        // POST: Certificates/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdCertificate,NameOfIssuerCert,CertificateStatus,IdStudent,IdCourse")] Certificate certificate)
        {
            if (id != certificate.IdCertificate)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    // Recuperar el certificado original de la base de datos
                    var originalCertificate = await _context.Certificate.AsNoTracking().FirstOrDefaultAsync(c => c.IdCertificate == id);

                    if (originalCertificate == null)
                    {
                        return NotFound();
                    }

                    // Preservar el código de verificación original
                    certificate.VerificationCode = originalCertificate.VerificationCode;
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
            ViewData["IdStudent"] = new SelectList(_context.Students, "IdStudent", "DocumentNumber");
            ViewData["IdCourse"] = new SelectList(_context.Courses, "IdCourse", "CourseName");
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

        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
