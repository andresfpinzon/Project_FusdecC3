using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Grade
{
    [Key]
    public Guid IdGrade { get; set; }
    public Grade()
    {
        this.IdGrade = Guid.NewGuid();
    }
    public string GradeTitle { get; set; }
    public bool Approved { get; set; }
    public ICollection<StudentGrade> StudentGrade { get; set; } = new List<StudentGrade>();
}

