
using Microsoft.AspNetCore.Identity;
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

    [StringLength(450)]
    public string? UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual IdentityUser User { get; set; } = null;
    public ICollection<StudentNonAttendance> StudentNonAttendance { get; set; } = new List<StudentNonAttendance>();
}
