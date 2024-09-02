using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Brigade
{
    /// <summary>
    /// Contiene el id de la brigada
    /// </summary>
    [Key]
    public Guid IdBrigade { get; set; }

    public Brigade()
    {
        this.IdBrigade = Guid.NewGuid();
    }
    /// <summary>
    /// Contiene el nombre de la brigada
    /// </summary>
    [StringLength(126)]
    public string BrigadeName { get; set; } = null!;

    /// <summary>
    /// Contiene la ubicacion de la brigada
    /// </summary>
    [StringLength(126)]
    public string BrigadeLocation { get; set; } = null!;

    /// <summary>
    /// Contiene el estado de la brigada
    /// </summary>
    public bool BrigadeStatus { get; set; }

    /// <summary>
    /// Fk con comando
    /// </summary>
    public Guid IdCommand { get; set; }

    [ForeignKey("IdCommand")]
    public  Command Command { get; set; } = null!;

    public  ICollection<Unit> Units { get; set; } = new List<Unit>();
}
