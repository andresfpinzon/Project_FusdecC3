using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("SuperAdmin")]
public partial class SuperAdmin
{
    /// <summary>
    /// Contiene el id del super administrador
    /// </summary>
    [Key]
    public Guid IdSA { get; set; }

    /// <summary>
    /// Contiene el nombre del super administrador
    /// </summary>
    [StringLength(126)]
    public string EmailSA { get; set; } = null!;

    /// <summary>
    /// Contiene la contraseña del super administrador
    /// </summary>
    [StringLength(60)]
    public string SAPassword { get; set; } = null!;

    [InverseProperty("SuperAdmin_IdSANavigation")]
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
