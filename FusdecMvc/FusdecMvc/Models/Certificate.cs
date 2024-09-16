using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Certificate
{
    [Key]
    public Guid IdCertificate { get; set; }
    public Certificate()
    {
        this.IdCertificate = Guid.NewGuid();
    }

    public string VerificationCode { get; set; } 

    public string NameOfIssuerCert { get; set; }

    public bool CertificateStatus { get; set; }

    public Guid IdStudent { get; set; }

    public Audit? Audit { get; set; }

    public Student Student { get; set; }
}
