using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class School
{
    [Key]
    public Guid IdSchool { get; set; }
    public School()
    {
        this.IdSchool = Guid.NewGuid();
    }

    public string SchoolName { get; set; } 
    public string SchoolEmail { get; set; } 

    public ICollection<Student> Students { get; set; } = new List<Student>();
}
