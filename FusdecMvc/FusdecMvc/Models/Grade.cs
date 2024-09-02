using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FusdecMvc.Models
{
    public partial class Grade
    {
        [Key]
        public int IdReport { get; set; }
        public Report Report { get; set; }


        public Guid IdGrade { get; set; }

        //mrk esto senti que puede que sirva despues por eso lo dejo el [Column("Grade")]
        [Column("Grade")]
        public bool Grade1 { get; set; }

        [Column(TypeName = "ntext")]
        public string? ObservationGrade { get; set; }

        public Grade()
        {
            this.IdGrade = Guid.NewGuid();

        }


        public virtual ICollection<StudentGrade> StudentGrades { get; set; } = new List<StudentGrade>();
    }
}

