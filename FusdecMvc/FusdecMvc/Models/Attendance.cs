using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.AspNetCore.Identity;
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
    public  NonAttendance? NonAttendance { get; set; }

    [StringLength(450)]
    public string? UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual IdentityUser User { get; set; } = null;

    public ICollection<StudentAttendance> StudentAttendances { get; set; } = new List<StudentAttendance>();
}
