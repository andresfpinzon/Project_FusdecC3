using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Student
{
    /// <summary>
    /// Contiene el id de la persona
    /// </summary>
    [Key]
    public Guid IdStudent { get; set; }

    /// <summary>
    /// Contiene la fecha de nacimiento de la persona
    /// </summary>
    public DateOnly StudentDateBirth { get; set; }

    /// <summary>
    /// Contiene el genereo del estudiante
    /// </summary>
    [StringLength(60)]
    public string StudentGender { get; set; } = null!;

    /// <summary>
    /// Fk unidad
    /// </summary>
    public Guid IdUnit { get; set; }

    /// <summary>
    /// Fk Attendance
    /// </summary>
    public Guid? IdAttendance { get; set; }

    /// <summary>
    /// Fk Colegio
    /// </summary>
    public Guid IdSchool { get; set; }

    [ForeignKey("IdAttendance")]
    public  Attendance? Attendance_IdAttendanceNavigation { get; set; }

    public  Certificate? Certificate { get; set; }

    [ForeignKey("IdSchool")]
    public School School { get; set; } 

    [ForeignKey("IdUnit")]
    public Unit Unit { get; set; } 

    public ICollection<StudentSchedule> StudentSchedules { get; set; } = new List<StudentSchedule>();
    public ICollection<StudentEdition> StudentEdition { get; set; } = new List<StudentEdition>();
    public ICollection<StudentGrade> StudentGrade { get; set; } = new List<StudentGrade>();
    public ICollection<StudentNonAttendance> StudentNonAttendance{ get; set; } = new List<StudentNonAttendance>();
}
