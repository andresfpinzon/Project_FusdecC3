
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FusdecMvc.Models;

public partial class NonAttendance
{
    [Key]
    public Guid IdNonAttendance { get; set; }
    public Guid IdAttendance { get; set; }
    public NonAttendance()
    {
        this.IdNonAttendance = Guid.NewGuid();
    }
    public Guid IdReport { get; set; }

    public Attendance Attendance { get; set; }
    public Report Report { get; set; }

    public ICollection<StudentNonAttendance> StudentNonAttendance { get; set; } = new List<StudentNonAttendance>();
}
