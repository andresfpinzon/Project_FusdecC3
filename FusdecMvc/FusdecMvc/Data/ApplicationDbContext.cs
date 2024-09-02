using FusdecMvc.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;

namespace FusdecMvc.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Mapeo de tablas
            modelBuilder.Entity<Grade>().ToTable("Grades");
            modelBuilder.Entity<NonAttendance>().ToTable("NonAttendance");

            // Configuración de claves compuestas para las tablas de identidad
            modelBuilder.Entity<IdentityUserLogin<string>>()
                .HasKey(ul => new { ul.UserId, ul.LoginProvider, ul.ProviderKey });

            modelBuilder.Entity<IdentityUserRole<string>>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<IdentityUserToken<string>>()
                .HasKey(ut => new { ut.UserId, ut.LoginProvider, ut.Name });         
        }

        // DbSets para cada entidad

        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Audit> Audits { get; set; }
        public DbSet<Brigade> Brigade { get; set; }
        public DbSet<Certificate> Certificate { get; set; }
        public DbSet<Command> Commands { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Edition> Editions {  get; set; }
        public DbSet<Fundation> Fundations { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<NonAttendance> NonAttendances { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<School> Schools { get; set; }
        public DbSet<Student> Students { get; set; }    
        public DbSet<StudentEdition> StudentEditions { get; set; }
        public DbSet<StudentGrade> studentGrades {  get; set; } 
        public DbSet<StudentNonAttendance> studentNonAttendances { get;set; }
        public DbSet<StudentSchedule> studentSchedules { get; set; }    


    }
}
