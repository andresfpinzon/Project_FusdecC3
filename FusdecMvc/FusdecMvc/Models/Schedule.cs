using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("Schedule")]
public partial class Schedule
{
    /// <summary>
    /// Contiene el id del horario
    /// </summary>
    [Key]
    public int IdSchedule { get; set; }

    /// <summary>
    /// Contiene el titulo del horario
    /// </summary>
    [StringLength(126)]
    public string ScheduleTitle { get; set; } = null!;

    /// <summary>
    /// Contiene la fecha de inicio de los horarios
    /// </summary>
    [Column(TypeName = "datetime")]
    public DateTime ScheduleStartDate { get; set; }

    /// <summary>
    /// contiene la fecha de fin de los horarios
    /// </summary>
    [Column(TypeName = "datetime")]
    public DateTime ScheduleEndDate { get; set; }

    /// <summary>
    /// Contiene el estado del horario
    /// </summary>
    public bool? ScheduleStatus { get; set; }

    /// <summary>
    /// Fk con rol
    /// </summary>
    public Guid Role_IdRole { get; set; }

    [ForeignKey("Role_IdRole")]
    [InverseProperty("Schedules")]
    public virtual Role Role_IdRoleNavigation { get; set; } = null!;

    [InverseProperty("Schedule_IdScheduleNavigation")]
    public virtual ICollection<Student_Schedule> Student_Schedules { get; set; } = new List<Student_Schedule>();
}
