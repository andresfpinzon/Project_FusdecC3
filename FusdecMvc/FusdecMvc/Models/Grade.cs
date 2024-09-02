using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Grade
{
    /// <summary>
    /// Contiene el id del reporte
    /// </summary>
    [Key]
    public Guid IdReport { get; set; }

    /// <summary>
    /// Contiene el id de la edicion
    /// </summary>
    public Guid IdGrade { get; set; }
    public Grade()
    {
        this.IdGrade = Guid.NewGuid();
    }
    /// <summary>
    /// Contiene la calificacion (aprobado, no aprobado)
    /// </summary>
    public bool Approved { get; set; }
    /// <summary>
    /// Observacion de la calificacion 
    /// </summary>
    [Column(TypeName = "ntext")]
    public string? ObservationGrade { get; set; }

    [ForeignKey("IdReport")]
    public Report IdReportNavigation { get; set; } 

    public ICollection<StudentGrade> StudentGrade { get; set; } = new List<StudentGrade>();
}

