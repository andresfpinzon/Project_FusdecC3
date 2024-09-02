 using System.ComponentModel.DataAnnotations;

namespace FusdecMvc.Models
{
    public class NonAttendance
    {
        [Key]
        public int IdReport { get; set; }
        public Report Report { get; set; }

        public Guid IdNonAttendance { get; set; }

        public Guid IdAttendance { get; set; }
        public Attendance Attendance { get; set; }

        public NonAttendance()
        {
            this.IdNonAttendance = Guid.NewGuid();
            this.IdAttendance = Guid.NewGuid();
        }

        public ICollection<StudentNonAttendence> StudentNonAttendences { get; set; } = new List<StudentNonAttendence>();
    }
}
