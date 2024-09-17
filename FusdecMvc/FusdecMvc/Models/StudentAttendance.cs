using System.ComponentModel.DataAnnotations;

namespace FusdecMvc.Models;

public class StudentAttendance
{
    public Guid IdStudent { get; set; }
    public Student Student { get; set; }

    public Guid IdAttendance { get; set; }
    public Attendance Attendance { get; set; }
}
