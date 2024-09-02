
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FusdecMvc.Models;

public partial class NonAttendance
{
    /// <summary>
    /// Contiene el id del reporte
    /// </summary>
    [Key]
    public Guid IdReport { get; set; }
    /// <summary>
    /// Contiene el id de la inasistencia
    /// </summary>
    public Guid IdNonAttendance { get; set; }
    public NonAttendance()
    {
        this.IdNonAttendance = Guid.NewGuid();
    }
    /// <summary>
    /// Fk con asistencia
    /// </summary>
    public Guid Attendance_IdAttendance { get; set; }
    [ForeignKey("IdAttendance")]
    public Attendance Attendance_IdAttendanceNavigation { get; set; } 
    [ForeignKey("IdReport")]
    public Report IdReportNavigation { get; set; } = null!;
    public ICollection<StudentNonAttendance> StudentNonAttendance { get; set; } = new List<StudentNonAttendance>();
}
