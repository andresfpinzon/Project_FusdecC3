using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;


namespace FusdecMvc.Models;

public partial class Command
{
    /// <summary>
    /// Contiene el id del comando
    /// </summary>
    [Key]
    public Guid IdCommand { get; set; }
    public Command()
    {
        this.IdCommand = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene el nombre del comando
    /// </summary>
    [StringLength(126)]
    public string CommandName { get; set; }

    /// <summary>
    /// Contiene el estado del comando
    /// </summary>
    public bool CommandStatus { get; set; }

    /// <summary>
    /// Contiene la ubicacion del comando
    /// </summary>
    [StringLength(126)]
    public string UbicacionComando { get; set; }
    /// <summary>
    /// Fk con fundacion
    /// </summary>
    public Guid IdFundaction { get; set; }

    public ICollection<Brigade> Brigades { get; set; } = new List<Brigade>();

    [ForeignKey("IdFundaction")]
    public Fundation Fundation { get; set; } 
}
