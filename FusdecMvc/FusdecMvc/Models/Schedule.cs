using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Schedule
{
    [Key]
    public Guid IdSchedule { get; set; }

    public Schedule()
    {
        this.IdSchedule = Guid.NewGuid();
    }

    public string ScheduleTitle { get; set; } 

    public DateTime ScheduleStartDate { get; set; }

    public DateTime ScheduleEndDate { get; set; }

    public bool ScheduleStatus { get; set; }

    public ICollection<EditionSchedule> StudentSchedules { get; set; } = new List<EditionSchedule>();
}
