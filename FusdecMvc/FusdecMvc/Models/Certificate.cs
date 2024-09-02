using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Certificate
{
    /// <summary>
    /// Contiene el uid del certificado
    /// </summary>
    [Key]
    public Guid IdCertificate { get; set; }
    public Certificate()
    {
        this.IdCertificate = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene los nombres del usuario que obtuvo el certificado
    /// </summary>
    [StringLength(126)]
    public string EstudentName { get; set; } = null!;

    /// <summary>
    /// Contiene los apellidos del usuario que obtuvo el certificado
    /// </summary>
    [StringLength(126)]
    public string StudentLastName { get; set; } = null!;

    /// <summary>
    /// Contiene el codigo verificador del certificado
    /// </summary>
    [StringLength(126)]
    public string VerificationCode { get; set; } = null!;

    /// <summary>
    /// Contiene el nombre de la persona que expidio el certificado
    /// </summary>
    [StringLength(256)]
    public string NameOfIssuerCert { get; set; } = null!;

    /// <summary>
    /// Contiene el numero de cocumento del usuario que obtuvo el certificado
    /// </summary>
    [StringLength(126)]
    public string UserDocumentNumber { get; set; } = null!;

    /// <summary>
    /// Contiene el Estado del estudiante
    /// </summary>
    public bool CertificateStatus { get; set; }

    /// <summary>
    /// Fk con estudiante
    /// </summary>
    public Guid IdStudent { get; set; }

    /// <summary>
    /// FK con curso
    /// </summary>
    public Guid IdCourse { get; set; }

    public Audit? Audit { get; set; }

    [ForeignKey("IdCourse")]
    public Course Course_IdCourseNavigation { get; set; } 

    [ForeignKey("IdStudent")]
    public Student Student_IdStudentNavigation { get; set; }
}
