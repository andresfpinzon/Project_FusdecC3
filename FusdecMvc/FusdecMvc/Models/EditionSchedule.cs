using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public class EditionSchedule
{
    public Guid IdEdition { get; set; }
    public Guid IdSchedule { get; set; }
    public Schedule Schedule { get; set; } 
    public Edition Edition { get; set; } 
}
