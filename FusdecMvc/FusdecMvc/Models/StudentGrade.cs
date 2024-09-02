using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models
{

    public class StudentGrade
    {
        [Key]
        public Guid IdStudent { get; set; }

        [Key]
        public Guid IdEdition { get; set; }

        [ForeignKey("IdGrade")]
        public Grade Grade { get; set; }

        [ForeignKey("IdStudent")]
        public Student Student { get; set; }
    }
}
