using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Grade : Report
{
    [Key]
    public Guid IdReport { get; set; }
    public Grade()
    {
        this.IdReport = Guid.NewGuid();
    }
    public bool Approved { get; set; }
    public string? ObservationGrade { get; set; }
    public Report Report { get; set; }

    public ICollection<StudentGrade> StudentGrade { get; set; } = new List<StudentGrade>();
}

