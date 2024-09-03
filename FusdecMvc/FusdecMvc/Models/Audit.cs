using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;
public partial class Audit
{
    [Key]
    public Guid IdAudit { get; set; }
    public Audit()
    {
        this.IdAudit = Guid.NewGuid();
    }

    public DateOnly AuditDate { get; set; }
    public string NameOfIssuerAudit { get; set; }


    public Guid IdCertificate { get; set; }

    public Certificate Certificate { get; set; } 
}
