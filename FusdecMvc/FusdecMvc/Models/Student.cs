using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Student
{
    [Key]
    public Guid IdStudent { get; set; }
    public Student()
    {
         this.IdStudent = Guid.NewGuid();
    }
    public DateOnly StudentDateBirth { get; set; }
    public string StudentGender { get; set; } 
    public Guid IdUnit { get; set; }
    public Guid IdSchool { get; set; }
    public  Certificate? Certificate { get; set; }
    public School School { get; set; } 
    public Unit Unit { get; set; } 

    public ICollection<StudentEdition> StudentEditions { get; set; } = new List<StudentEdition>();
    public ICollection<StudentSchedule> StudentSchedules { get; set; } = new List<StudentSchedule>();
    public ICollection<StudentGrade> StudentGrades { get; set; } = new List<StudentGrade>();
    public ICollection<StudentNonAttendance> StudentNonAttendances { get; set; } = new List<StudentNonAttendance>();
    public ICollection<StudentAttendance> StudentAttendances { get; set; } = new List<StudentAttendance>();
}
