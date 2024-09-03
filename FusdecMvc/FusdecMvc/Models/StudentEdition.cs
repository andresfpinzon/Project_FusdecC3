using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

    public class StudentEdition
    {
        public Guid IdStudent { get; set; }
        public Guid IdEdition{ get; set; }
        public Edition Edition { get; set; } 
        public Student Student { get; set; } 
    }

