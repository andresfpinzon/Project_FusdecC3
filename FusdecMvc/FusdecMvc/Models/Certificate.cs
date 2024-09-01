using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("Certificate")]
[Index("Student_IdStudent", Name = "Certificate__IDX", IsUnique = true)]
public partial class Certificate
{
    /// <summary>
    /// Contiene el uid del certificado
    /// </summary>
    [Key]
    public Guid IdCertificate { get; set; }

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
    public Guid Student_IdStudent { get; set; }

    /// <summary>
    /// FK con curso
    /// </summary>
    public Guid Course_IdCourse { get; set; }

    /// <summary>
    /// Fk con rol
    /// </summary>
    public Guid Role_IdRole { get; set; }

    [InverseProperty("Certificate_IdCertificateNavigation")]
    public virtual Audit? Audit { get; set; }

    [ForeignKey("Course_IdCourse")]
    [InverseProperty("Certificates")]
    public virtual Course Course_IdCourseNavigation { get; set; } = null!;

    [ForeignKey("Role_IdRole")]
    [InverseProperty("Certificates")]
    public virtual Role Role_IdRoleNavigation { get; set; } = null!;

    [ForeignKey("Student_IdStudent")]
    [InverseProperty("Certificate")]
    public virtual Student Student_IdStudentNavigation { get; set; } = null!;
}
