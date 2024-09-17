using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;


namespace FusdecMvc.Models;

public partial class Command
{
    [Key]
    public Guid IdCommand { get; set; }
    public Command()
    {
        this.IdCommand = Guid.NewGuid();
    }

    public string CommandName { get; set; }

    public bool CommandStatus { get; set; }

    public string UbicacionComando { get; set; }

    public Guid IdFundation { get; set; }

    public ICollection<Brigade> Brigades { get; set; } = new List<Brigade>();

    public Fundation Fundation { get; set; } 
}
