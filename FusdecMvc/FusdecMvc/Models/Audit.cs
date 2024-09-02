using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;
public partial class Audit
{
    /// <summary>
    /// Contiene el uid de la auditoria para cada certificado
    /// </summary>
    [Key]
    public Guid IdAudit { get; set; }
    public Audit()
    {
        this.IdAudit = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene la fecha en que el certificado fue expedido
    /// </summary>
    public DateOnly AuditDate { get; set; }

    /// <summary>
    /// Contiene el nombre de la persona que expidio el certificado
    /// </summary>
    [StringLength(256)]
    public string NameOfIssuerAudit { get; set; }

    /// <summary>
    /// Fk con certificado
    /// </summary>
    public Guid IdCertificate { get; set; }

    [ForeignKey("IdCertificate")]
    public Certificate Certificate { get; set; } 
}
