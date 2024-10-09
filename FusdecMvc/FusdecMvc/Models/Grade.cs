using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
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

    [StringLength(450)]
    public string? UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual IdentityUser User { get; set; } = null;
    public ICollection<StudentGrade> StudentGrade { get; set; } = new List<StudentGrade>();
}

