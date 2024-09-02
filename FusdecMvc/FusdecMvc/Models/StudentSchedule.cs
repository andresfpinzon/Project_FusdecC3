using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public class StudentSchedule
{
    [Key]
    public Guid IdStudent { get; set; }

    [Key]
    public Guid IdSchedule { get; set; }

    public DateOnly? Fecha { get; set; }

    [ForeignKey("IdSchedule")]
    public Schedule Schedule { get; set; } = null!;

    [ForeignKey("IdStudent")]
    public Student Student { get; set; } = null!;
}
