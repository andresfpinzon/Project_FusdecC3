using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using FusdecMvc.Data;
using FusdecMvc.Models;
using Microsoft.AspNetCore.Components.Forms;

namespace FusdecMvc.Controllers
{
    public class StudentsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Students
        public async Task<IActionResult> Index()
        {
            var Students = _context.Students
                .Include(s => s.School)
                .Include(s => s.Unit)
                .Include(s => s.StudentEditions)
                    .ThenInclude(se => se.Edition);
            return View(await Students.ToListAsync());
        }

        // GET: Students/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var student = await _context.Students
                .Include(s => s.School)
                .Include(s => s.Unit)
                .Include(s => s.StudentEditions)
                    .ThenInclude(se => se.Edition)
                .FirstOrDefaultAsync(m => m.IdStudent == id);
            if (student == null)
            {
                return NotFound();
            }

            return View(student);
        }

        // GET: Students/Create
        public IActionResult Create()
        {
            ViewBag.Editions = _context.Editions.ToList();
            ViewData["IdSchool"] = new SelectList(_context.Schools, "IdSchool", "SchoolName");
            ViewData["IdUnit"] = new SelectList(_context.Units, "IdUnit", "UnitName");
            return View();
        }

        // POST: Students/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdStudent,StudentName,StudentLastName,DocumentType,DocumentNumber,StudentDateBirth,StudentGender,IdUnit,IdSchool,StudentStatus")] Student student, Guid[] selectedEditions)
        {
            //if (ModelState.IsValid)
            {
                student.IdStudent = Guid.NewGuid();
                _context.Add(student);
                await _context.SaveChangesAsync();
                if (selectedEditions != null && selectedEditions.Length > 0)
                {
                    foreach (var editionId in selectedEditions)
                    {
                        var studentEdition = new StudentEdition
                        {
                            IdStudent = student.IdStudent,
                            IdEdition = editionId
                        };
                        _context.StudentEditions.Add(studentEdition);
                    }
                    await _context.SaveChangesAsync();
                }

                return RedirectToAction(nameof(Index));
            }
            ViewBag.Editions = _context.Editions.ToList();
            ViewData["IdSchool"] = new SelectList(_context.Schools, "IdSchool", "SchoolName");
            ViewData["IdUnit"] = new SelectList(_context.Units, "IdUnit", "UnitName");
            return View(student);
        }

        // GET: Students/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var student = await _context.Students
                .Include(s => s.StudentEditions)
                    .ThenInclude(se => se.Edition)
                .FirstOrDefaultAsync(s => s.IdStudent == id);
            if (student == null)
            {
                return NotFound();
            }

            var editions = await _context.Editions.ToListAsync();
            ViewData["Editions"] = new MultiSelectList(editions, "IdEdition", "Title", student.StudentEditions.Select(se => se.IdEdition));

            ViewData["IdSchool"] = new SelectList(_context.Schools, "IdSchool", "SchoolName");
            ViewData["IdUnit"] = new SelectList(_context.Units, "IdUnit", "UnitName");
            return View(student);
        }

        // POST: Students/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("IdStudent,StudentName,StudentLastName,DocumentType,DocumentNumber,StudentDateBirth,StudentGender,IdUnit,IdSchool,StudentStatus")] Student student, Guid[] selectedEditions)
        {
            if (id != student.IdStudent)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(student);
                    // Eliminar las ediciones antiguas
                    var existingStudentEditions = _context.StudentEditions.Where(se => se.IdStudent == id);
                    _context.StudentEditions.RemoveRange(existingStudentEditions);
                    // Agregar las nuevas ediciones seleccionadas
                    if (selectedEditions != null)
                    {
                        foreach (var editionId in selectedEditions)
                        {
                            _context.StudentEditions.Add(new StudentEdition { IdStudent = id, IdEdition = editionId });
                        }
                    }

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StudentExists(student.IdStudent))
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
            var editions = await _context.Editions.ToListAsync();
            ViewData["Editions"] = new MultiSelectList(editions, "IdEdition", "EditionTitle", selectedEditions);

            ViewData["IdSchool"] = new SelectList(_context.Schools, "IdSchool", "SchoolName");
            ViewData["IdUnit"] = new SelectList(_context.Units, "IdUnit", "UnitName");
            return View(student);
        }

        // GET: Students/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var student = await _context.Students
                .Include(s => s.School)
                .Include(s => s.Unit)
                .Include(s => s.StudentEditions)
                    .ThenInclude(se => se.Edition)
                .FirstOrDefaultAsync(m => m.IdStudent == id);
            if (student == null)
            {
                return NotFound();
            }

            return View(student);
        }

        // POST: Students/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student != null)
            {
                _context.Students.Remove(student);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool StudentExists(Guid id)
        {
            return _context.Students.Any(e => e.IdStudent == id);
        }
    }
}
