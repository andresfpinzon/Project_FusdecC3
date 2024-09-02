using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("Student")]
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
    public Guid Unit_IdUnit { get; set; }

    /// <summary>
    /// Fk Attendance
    /// </summary>
    public Guid? Attendance_IdAttendance { get; set; }

    /// <summary>
    /// Fk con user
    /// </summary>
    public Guid AppUser_IdUser { get; set; }

    /// <summary>
    /// Fk Colegio
    /// </summary>
    public Guid School_IdSchool { get; set; }

    [ForeignKey("AppUser_IdUser")]
    [InverseProperty("Students")]
    public virtual AppUser AppUser_IdUserNavigation { get; set; } = null!;

    [ForeignKey("Attendance_IdAttendance")]
    [InverseProperty("Students")]
    public virtual Attendance? Attendance_IdAttendanceNavigation { get; set; }

    [InverseProperty("Student_IdStudentNavigation")]
    public virtual Certificate? Certificate { get; set; }

    [ForeignKey("School_IdSchool")]
    [InverseProperty("Students")]
    public virtual School School_IdSchoolNavigation { get; set; } = null!;

    [InverseProperty("Student_IdStudentNavigation")]
    public virtual ICollection<Student_Schedule> Student_Schedules { get; set; } = new List<Student_Schedule>();

    [ForeignKey("Unit_IdUnit")]
    [InverseProperty("Students")]
    public virtual Unit Unit_IdUnitNavigation { get; set; } = null!;

    [ForeignKey("Student_IdStudent")]
    [InverseProperty("Student_IdStudents")]
    public virtual ICollection<Edition> Edition_IdEditions { get; set; } = new List<Edition>();

    [ForeignKey("Student_IdStudent")]
    [InverseProperty("Student_IdStudents")]
    public virtual ICollection<Grade> Grade_IdReports { get; set; } = new List<Grade>();

    [ForeignKey("Student_IdStudent")]
    [InverseProperty("Student_IdStudents")]
    public virtual ICollection<NonAttendance> NonAttendance_IdReports { get; set; } = new List<NonAttendance>();
}
