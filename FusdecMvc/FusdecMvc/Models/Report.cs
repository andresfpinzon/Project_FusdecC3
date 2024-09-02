using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;


public partial class Report
{
    /// <summary>
    /// Contiene el id del reporte
    /// </summary>
    [Key]
    public Guid IdReport { get; set; }
    public Report()
    {
        this.IdReport = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene una descripcion del reporte
    /// </summary>
    [Column(TypeName = "ntext")]
    public string Observation { get; set; } 

    public Grade? Grade { get; set; }

    public NonAttendance? NonAttendance { get; set; }

}

