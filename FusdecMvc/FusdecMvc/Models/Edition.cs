using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Edition
{
    [Key]
    public Guid IdEdition { get; set; }
    public Edition()
    {
        this.IdEdition = Guid.NewGuid();
    }

    public DateOnly EditionStartDate { get; set; }

    public DateOnly EditionEndDate { get; set; }

    public Guid IdCourse { get; set; }

    public Course Course { get; set; }

    public ICollection<StudentEdition> StudentEditions { get; set; } = new List<StudentEdition>();
}


