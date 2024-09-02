using System.ComponentModel.DataAnnotations;

namespace FusdecMvc.Models
{
    public class Edition
    {
        [Key]
        public Guid IdEdition { get; set; }

        public DateOnly EditionStartDate { get; set; }

        public DateOnly EditionEndDate { get; set; }

        public Guid IdCourse { get; set; }
        public Course Course { get; set; }

        public Edition()
        {
            this.IdEdition = Guid.NewGuid();
            this.IdCourse = Guid.NewGuid();
        }


        public virtual ICollection<StudentEdition> StudentEditions { get; set; } = new List<StudentEdition>();
    }
}


