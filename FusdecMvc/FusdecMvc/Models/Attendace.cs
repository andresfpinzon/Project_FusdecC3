using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("Attendance")]
public partial class Attendance
{
    /// <summary>
    /// Contiene el Id de la asistencia
    /// </summary>
    [Key]
    public Guid IdAttendance { get; set; }

    /// <summary>
    /// Contiene la fecha de la toma de asistencia
    /// </summary>
    [Column(TypeName = "datetime")]
    public DateTime AttendanceDate { get; set; }

    /// <summary>
    /// Contiene el estado de la asistencia
    /// </summary>
    public bool AttendanceStatus { get; set; }

    /// <summary>
    /// Fk con rol
    /// </summary>
    public Guid Role_IdRole { get; set; }

    [InverseProperty("Attendance_IdAttendanceNavigation")]
    public virtual NonAttendance? NonAttendance { get; set; }

    [ForeignKey("Role_IdRole")]
    [InverseProperty("Attendances")]
    public virtual Role Role_IdRoleNavigation { get; set; } = null!;

    [InverseProperty("Attendance_IdAttendanceNavigation")]
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
