using FusdecMvc.Models;
using Humanizer.Configuration;
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

            // Configuración de claves compuestas para las tablas de identidad
            modelBuilder.Entity<IdentityUserLogin<string>>()
                .HasKey(ul => new { ul.UserId, ul.LoginProvider, ul.ProviderKey });

            modelBuilder.Entity<IdentityUserRole<string>>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<IdentityUserToken<string>>()
                .HasKey(ut => new { ut.UserId, ut.LoginProvider, ut.Name });

            // Configuración de la tabla de rompimiento StudentAttendance
            modelBuilder.Entity<StudentAttendance>()
                .HasKey(sa => new { sa.IdStudent, sa.IdAttendance });

            modelBuilder.Entity<StudentAttendance>()
                .HasOne(sa => sa.Student)
                .WithMany(s => s.StudentAttendances)
                .HasForeignKey(sa => sa.IdStudent);

            modelBuilder.Entity<StudentAttendance>()
                .HasOne(sa => sa.Attendance)
                .WithMany(a => a.StudentAttendances)
                .HasForeignKey(sa => sa.IdAttendance);

            // Configuración de la tabla de rompimiento StudentEdition
            modelBuilder.Entity<StudentEdition>()
                .HasKey(se => new { se.IdStudent, se.IdEdition });

            modelBuilder.Entity<StudentEdition>()
                .HasOne(se => se.Student)
                .WithMany(s => s.StudentEditions)
                .HasForeignKey(se => se.IdStudent)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentEdition>()
                .HasOne(se => se.Edition)
                .WithMany(e => e.StudentEditions)
                .HasForeignKey(se => se.IdEdition)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de la tabla de rompimiento StudentGrade
            modelBuilder.Entity<StudentGrade>()
                .HasKey(sg => new { sg.IdStudent, sg.IdGrade });

            modelBuilder.Entity<StudentGrade>()
                .HasOne(sg => sg.Student)
                .WithMany(s => s.StudentGrades)
                .HasForeignKey(sg => sg.IdStudent)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentGrade>()
                .HasOne(sg => sg.Grade)
                .WithMany(g => g.StudentGrade)
                .HasForeignKey(sg => sg.IdGrade)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de la tabla de rompimiento StudentNonAttendance
            modelBuilder.Entity<StudentNonAttendance>()
                .HasKey(sna => new { sna.IdStudent, sna.IdNonAttendance });

            modelBuilder.Entity<StudentNonAttendance>()
                .HasOne(sna => sna.Student)
                .WithMany(s => s.StudentNonAttendances)
                .HasForeignKey(sna => sna.IdStudent)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentNonAttendance>()
                .HasOne(sna => sna.NonAttendance)
                .WithMany(na => na.StudentNonAttendance)
                .HasForeignKey(sna => sna.IdNonAttendance)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de la tabla de rompimiento StudentSchedule
            modelBuilder.Entity<StudentSchedule>()
                .HasKey(ss => new { ss.IdStudent, ss.IdSchedule });

            modelBuilder.Entity<StudentSchedule>()
                .HasOne(ss => ss.Student)
                .WithMany(s => s.StudentSchedules)
                .HasForeignKey(ss => ss.IdStudent);

            modelBuilder.Entity<StudentSchedule>()
                .HasOne(ss => ss.Schedule)
                .WithMany(s => s.StudentSchedules)
                .HasForeignKey(ss => ss.IdSchedule);

            // Configuración de la relación entre Command y Brigade
            modelBuilder.Entity<Brigade>()
                .HasOne(b => b.Command)
                .WithMany(c => c.Brigades)
                .HasForeignKey(b => b.IdCommand);

            // Configuración de la relación entre Unit y Brigade
            modelBuilder.Entity<Unit>()
                .HasOne(u => u.Brigade)
                .WithMany(b => b.Units)
                .HasForeignKey(u => u.IdBrigade);

            // Configuración de la relación entre Fundation y Command
            modelBuilder.Entity<Command>()
                .HasOne(c => c.Fundation)
                .WithMany(f => f.Commands)
                .HasForeignKey(c => c.IdFundation);

            // Configuración de la relación entre Course y Fundation
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Fundation)
                .WithMany(f => f.Courses)
                .HasForeignKey(c => c.IdFundation);
           
            // Configuracion de la relacion entre attendance y nonAtendance
            modelBuilder.Entity<NonAttendance>()
                .HasOne(n => n.Attendance)
                .WithOne(a => a.NonAttendance)
                .HasForeignKey<NonAttendance>(n => n.IdAttendance)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuracion de la relacion entre attendance y nonAtendance
            modelBuilder.Entity<Audit>()
                .HasOne(a => a.Certificate)
                .WithOne(c => c.Audit)
                .HasForeignKey<Audit>(a => a.IdCertificate)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuracion de la relacion entre certificado y studiante
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Student)
                .WithOne(s => s.Certificate)
                .HasForeignKey<Certificate>(c => c.IdStudent)
                .OnDelete(DeleteBehavior.Cascade);


           // Configurar la relación entre Report y Grade
            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Report)
                .WithOne() 
                .HasForeignKey<Grade>(g => g.IdReport)
                .OnDelete(DeleteBehavior.Cascade);

            // Configurar la relación entre Report y NonAttendance
            modelBuilder.Entity<NonAttendance>()
                .HasOne(na => na.Report)
                .WithMany() 
                .HasForeignKey(na => na.IdReport)
                .OnDelete(DeleteBehavior.Cascade);

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
        public DbSet<StudentAttendance> studentAttendances { get; set; }     


    }
}
