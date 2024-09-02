using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Fundation
{
    /// <summary>
    /// Contiene el id de la fundcion
    /// </summary>
    [Key]
    public Guid IdFundaction { get; set; }
    public Fundation()
    {
        this.IdFundaction = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene el nombre de la fundacion
    /// </summary>
    [StringLength(126)]
    public string FundationName { get; set; }

    public ICollection<Command> Commands { get; set; } = new List<Command>();
    public  ICollection<Course> Courses { get; set; } = new List<Course>();
}

