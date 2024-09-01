using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("Audit")]
[Index("Certificate_IdCertificate", Name = "Audit__IDX", IsUnique = true)]
public partial class Audit
{
    /// <summary>
    /// Contiene el uid de la auditoria para cada certificado
    /// </summary>
    [Key]
    public int IdAudit { get; set; }

    /// <summary>
    /// Contiene la fecha en que el certificado fue expedido
    /// </summary>
    public DateOnly AuditDate { get; set; }

    /// <summary>
    /// Contiene el nombre de la persona que expidio el certificado
    /// </summary>
    [StringLength(256)]
    public string NameOfIssuerAudit { get; set; } = null!;

    /// <summary>
    /// Fk con certificado
    /// </summary>
    public Guid Certificate_IdCertificate { get; set; }

    [ForeignKey("Certificate_IdCertificate")]
    [InverseProperty("Audit")]
    public virtual Certificate Certificate_IdCertificateNavigation { get; set; } = null!;
}
