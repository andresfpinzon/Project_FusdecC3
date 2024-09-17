using Microsoft.AspNetCore.Identity;

namespace FusdecMvc.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Llave foránea para conectar con la tabla Estudiantes
        public Guid? IdStudent { get; set; }

        // Propiedad de navegación
        public Student Student { get; set; }
    }
}
