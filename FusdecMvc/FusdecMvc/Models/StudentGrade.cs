using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;


public class StudentGrade
{
    public Guid IdStudent { get; set; }
    public Guid IdGrade { get; set; }
    public Grade Grade { get; set; }
    public Student Student { get; set; }
}
