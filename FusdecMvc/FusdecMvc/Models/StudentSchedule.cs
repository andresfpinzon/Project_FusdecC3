using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public class StudentSchedule
{
    public Guid IdStudent { get; set; }
    public Guid IdSchedule { get; set; }
    public DateOnly? Fecha { get; set; }
    public Schedule Schedule { get; set; } 
    public Student Student { get; set; } 
}
