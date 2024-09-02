using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;
public partial class Attendance
{
    /// <summary>
    /// Contiene el Id de la asistencia
    /// </summary>
    [Key]
    public Guid IdAttendance { get; set; }

    public Attendance()
    {
        this.IdAttendance = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene la fecha de la toma de asistencia
    /// </summary>
    [Column(TypeName = "datetime")]
    public DateTime AttendanceDate { get; set; }

    /// <summary>
    /// Contiene el estado de la asistencia
    /// </summary>
    public bool AttendanceStatus { get; set; }

    public  NonAttendance? NonAttendance { get; set; }

    public ICollection<Student> Students { get; set; } = new List<Student>();
}
