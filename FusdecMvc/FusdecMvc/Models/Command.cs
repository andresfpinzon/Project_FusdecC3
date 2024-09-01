using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace FusdecMvc.Models;

[Table("Command")]
public partial class Command
{
    /// <summary>
    /// Contiene el id del comando
    /// </summary>
    [Key]
    public Guid IdCommand { get; set; }

    /// <summary>
    /// Contiene el nombre del comando
    /// </summary>
    [StringLength(126)]
    public string CommandName { get; set; } = null!;

    /// <summary>
    /// Contiene el estado del comando
    /// </summary>
    public bool CommandStatus { get; set; }

    /// <summary>
    /// Contiene la ubicacion del comando
    /// </summary>
    [StringLength(126)]
    public string UbicacionComando { get; set; } = null!;

    /// <summary>
    /// Fk con fundacion
    /// </summary>
    public Guid Fundation_IdFundaction { get; set; }

    [InverseProperty("Command_IdCommandNavigation")]
    public virtual ICollection<Brigade> Brigades { get; set; } = new List<Brigade>();

    [ForeignKey("Fundation_IdFundaction")]
    [InverseProperty("Commands")]
    public virtual Fundation Fundation_IdFundactionNavigation { get; set; } = null!;
}
