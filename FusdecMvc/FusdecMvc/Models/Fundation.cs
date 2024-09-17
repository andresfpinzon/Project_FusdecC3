using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Fundation
{
    [Key]
    public Guid IdFundation { get; set; }
    public Fundation()
    {
        this.IdFundation = Guid.NewGuid();
    }

    public string FundationName { get; set; }
    public ICollection<Command> Commands { get; set; } = new List<Command>();
    public  ICollection<Course> Courses { get; set; } = new List<Course>();
}

