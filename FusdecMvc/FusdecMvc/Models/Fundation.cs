using System.ComponentModel.DataAnnotations;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace FusdecMvc.Models
{
    public class Fundation
    {
        [Key]
        public Guid IdFundaction { get; set; }

        [StringLength(126)]
        public string FundationName { get; set; } = null!;

        public Fundation()
        {
            this.IdFundaction = Guid.NewGuid();
        }

        public virtual ICollection<Command> Commands { get; set; } = new List<Command>();


        public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}

