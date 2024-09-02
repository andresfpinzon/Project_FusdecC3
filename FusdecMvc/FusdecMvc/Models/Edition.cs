using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public partial class Edition
{
    /// <summary>
    /// Contiene el id de la edicion
    /// </summary>
    [Key]
    public Guid IdEdition { get; set; }
    public Edition()
    {
        this.IdEdition = Guid.NewGuid();
    }
    /// <summary>
    /// Contiene el inicio de la edicion
    /// </summary>
    public DateOnly EditionStartDate { get; set; }

    /// <summary>
    /// Contiene el final de la edicion
    /// </summary>
    public DateOnly EditionEndDate { get; set; }

    /// <summary>
    /// Fk Con curso
    /// </summary>
    public Guid IdCourse { get; set; }

    public Course Course { get; set; }

    public ICollection<StudentEdition> StudentEdition { get; set; } = new List<StudentEdition>();
}


