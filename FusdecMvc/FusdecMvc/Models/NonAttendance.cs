
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
    public Attendance Attendance { get; set; }
    public string NonAttendanceTitle { get; set; }
    public string Observacion { get; set; }

    public ICollection<StudentNonAttendance> StudentNonAttendance { get; set; } = new List<StudentNonAttendance>();
}
