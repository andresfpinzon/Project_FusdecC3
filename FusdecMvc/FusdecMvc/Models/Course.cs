using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FusdecMvc.Models
{
    public class Course
    {
        [Key]
        public Guid IdCourse { get; set; }

        [StringLength(256)]
        public string CourseName { get; set; } = null!;

        [Column(TypeName = "ntext")]
        public string CourseDescription { get; set; } = null!;

        [StringLength(126)]
        public string CourseHourlyIntensity { get; set; } = null!;

        public bool CourseEstatus { get; set; }

        public Course()
        {
            this.IdCourse = Guid.NewGuid();
        }

        //mrk esto lo deje porque lo traia pero creo que no va porque fundacion solo hay una y cada que un curso se cree no se va a crear una nueva si me hago entender?
        public Guid IdFundaction { get; set; }
        public Fundation Fundation { get; set; }


        public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();


        public ICollection<Edition> Editions { get; set; } = new List<Edition>();


        public ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}

