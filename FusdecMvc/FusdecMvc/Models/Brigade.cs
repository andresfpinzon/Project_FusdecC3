using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Brigade
{
    [Key]
    public Guid IdBrigade { get; set; }

    public Brigade()
    {
        this.IdBrigade = Guid.NewGuid();
    }

    public string BrigadeName { get; set; } 
    public string BrigadeLocation { get; set; } 
    public bool BrigadeStatus { get; set; }
    public Guid IdCommand { get; set; }

    public  Command Command { get; set; } 

    public  ICollection<Unit> Units { get; set; } = new List<Unit>();
}
