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
    [Key]
    public Guid IdReport { get; set; }
    public Report()
    {
        this.IdReport = Guid.NewGuid();
    }

    public string Observation { get; set; }

}

