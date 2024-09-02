using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Schedule
{
    /// <summary>
    /// Contiene el id del horario
    /// </summary>
    [Key]
    public Guid IdSchedule { get; set; }

    public Schedule()
    {
        this.IdSchedule = Guid.NewGuid();
    }
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

    public ICollection<StudentSchedule> StudentSchedules { get; set; } = new List<StudentSchedule>();
}
