using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;
public partial class Course
{
    [Key]
    public Guid IdCourse { get; set; }
    public Course()
    {
        this.IdCourse = Guid.NewGuid();
    }

    public string CourseName { get; set; } 

    public string CourseDescription { get; set; }

    public string CourseHourlyIntensity { get; set; }

    public bool CourseEstatus { get; set; }

    public Guid IdFundation { get; set; }

    public  ICollection<Edition> Editions { get; set; } = new List<Edition>();

    public  Fundation Fundation { get; set; }

}


