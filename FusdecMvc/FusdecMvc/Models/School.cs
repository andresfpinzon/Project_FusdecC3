using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FusdecMvc.Models;

[Table("School")]
public partial class School
{
    /// <summary>
    /// Contiene el id del colegio
    /// </summary>
    [Key]
    public Guid IdSchool { get; set; }
    public School()
    {
        this.IdSchool = Guid.NewGuid();
    }

    /// <summary>
    /// Contiene el nombre del colegio
    /// </summary>
    [StringLength(126)]
    public string SchoolName { get; set; } = null!;

    /// <summary>
    /// Contiene el correo electronico de la escuela
    /// </summary>
    [StringLength(126)]
    public string SchoolEmail { get; set; } = null!;

    public ICollection<Student> Students { get; set; } = new List<Student>();
}
