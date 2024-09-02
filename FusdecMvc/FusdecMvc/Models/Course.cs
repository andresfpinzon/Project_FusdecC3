using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;
public partial class Course
{
    /// <summary>
    /// Contiene el id del curso
    /// </summary>
    [Key]
    public Guid IdCourse { get; set; }
    public Course()
    {
        this.IdCourse = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene el nombre del curso
    /// </summary>
    [StringLength(256)]
    public string CourseName { get; set; } 

    /// <summary>
    /// Contiene una breve descripcion del curso
    /// </summary>
    [Column(TypeName = "ntext")]
    public string CourseDescription { get; set; }

    /// <summary>
    /// Contiene la intensidad horaria del curso
    /// </summary>
    [StringLength(126)]
    public string CourseHourlyIntensity { get; set; }

    /// <summary>
    /// Contiene si el curso esta activo o no
    /// </summary>
    public bool CourseEstatus { get; set; }

    /// <summary>
    /// Fk con Fundacion
    /// </summary>
    public Guid IdFundation { get; set; }

    public  ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

    public  ICollection<Edition> Editions { get; set; } = new List<Edition>();

    [ForeignKey("IdFundaction")]
    public  Fundation Fundation { get; set; }

}


