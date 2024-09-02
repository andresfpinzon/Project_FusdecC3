

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("Unit")]
public partial class Unit
{
    /// <summary>
    /// Contiene el id de la unidad
    /// </summary>
    [Key]
    public Guid IdUnit { get; set; }

    /// <summary>
    /// Contiene el nombre de la unidad
    /// </summary>
    [StringLength(256)]
    public string UnitName { get; set; } = null!;

    /// <summary>
    /// Contiene el estado de la unidad
    /// </summary>
    public bool UnitState { get; set; }

    /// <summary>
    /// Contiene la ubicacion de la unidad
    /// </summary>
    [StringLength(126)]
    public string UnitLocation { get; set; } = null!;

    /// <summary>
    /// Fk con brigada
    /// </summary>
    public Guid Brigade_IdBrigade { get; set; }

    [ForeignKey("Brigade_IdBrigade")]
    [InverseProperty("Units")]
    public virtual Brigade Brigade_IdBrigadeNavigation { get; set; } = null!;

    [InverseProperty("Unit_IdUnitNavigation")]
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
