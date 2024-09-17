using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;
public partial class Attendance
{
    [Key]
    public Guid IdAttendance { get; set; }

    public Attendance()
    {
        this.IdAttendance = Guid.NewGuid();
    }
    public string AttendanceTitle { get; set; } 
    public DateTime AttendanceDate { get; set; }
    public bool AttendanceStatus { get; set; }

    public  NonAttendance? NonAttendance { get; set; }

    public ICollection<StudentAttendance> StudentAttendances { get; set; } = new List<StudentAttendance>();
}
