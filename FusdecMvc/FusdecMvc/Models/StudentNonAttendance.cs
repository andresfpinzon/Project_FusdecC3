using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

public class StudentNonAttendance
{
    public Guid IdStudent { get; set; }
    public Guid IdNonAttendance { get; set; }
    public Student Student { get; set; }
    public NonAttendance NonAttendance { get; set; }
}
