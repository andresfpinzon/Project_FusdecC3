using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace FusdecMvc.Models;

[Table("Brigade")]
public partial class Brigade
{
    /// <summary>
    /// Contiene el id de la brigada
    /// </summary>
    [Key]
    public Guid IdBrigade { get; set; }

    /// <summary>
    /// Contiene el nombre de la brigada
    /// </summary>
    [StringLength(126)]
    public string BrigadeName { get; set; } = null!;

    /// <summary>
    /// Contiene la ubicacion de la brigada
    /// </summary>
    [StringLength(256)]
    public string BrigadeLocation { get; set; } = null!;

    /// <summary>
    /// Contiene el estado de la brigada
    /// </summary>
    public bool BrigadeStatus { get; set; }

    /// <summary>
    /// Fk con comando
    /// </summary>
    public Guid Command_IdCommand { get; set; }

    [ForeignKey("Command_IdCommand")]
    [InverseProperty("Brigades")]
    public virtual Command Command_IdCommandNavigation { get; set; } = null!;

    [InverseProperty("Brigade_IdBrigadeNavigation")]
    public virtual ICollection<Unit> Units { get; set; } = new List<Unit>();
}
