using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FusdecMvc.Models
{
    public class Report
    {
        [Key]
        public int IdReport { get; set; }

        [Column(TypeName = "ntext")]
        public string Observation { get; set; } = null!;

        public Guid IdRole { get; set; }

        public Report()
        {
            this.IdRole = Guid.NewGuid();
        }

        public ICollection<NonAttendance> NonAtendances { get; set; } = new List<NonAttendance>();


        public ICollection<Grade> Grades { get; set; } = new List<Grade>();

    }
}
