

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Unit
{
    [Key]
    public Guid IdUnit { get; set; }
    public Unit()
    {
        this.IdUnit = Guid.NewGuid();
    }
    public string UnitName { get; set; }
    public bool UnitState { get; set; }
    public Guid IdBrigade { get; set; }
    public virtual Brigade Brigade { get; set; } 
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
