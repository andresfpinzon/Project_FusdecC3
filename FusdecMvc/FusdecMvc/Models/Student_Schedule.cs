using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[PrimaryKey("Student_IdStudent", "Schedule_IdSchedule")]
[Table("Student_Schedule")]
public partial class Student_Schedule
{
    [Key]
    public Guid Student_IdStudent { get; set; }

    [Key]
    public int Schedule_IdSchedule { get; set; }

    public DateOnly Fecha { get; set; }

    [ForeignKey("Schedule_IdSchedule")]
    [InverseProperty("Student_Schedules")]
    public virtual Schedule Schedule_IdScheduleNavigation { get; set; } = null!;

    [ForeignKey("Student_IdStudent")]
    [InverseProperty("Student_Schedules")]
    public virtual Student Student_IdStudentNavigation { get; set; } = null!;
}
