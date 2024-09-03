using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Attendances",
                columns: table => new
                {
                    IdAttendance = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttendanceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AttendanceStatus = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendances", x => x.IdAttendance);
                });

            migrationBuilder.CreateTable(
                name: "Fundations",
                columns: table => new
                {
                    IdFundation = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FundationName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fundations", x => x.IdFundation);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    IdReport = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Observation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Approved = table.Column<bool>(type: "bit", nullable: true),
                    ObservationGrade = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.IdReport);
                });

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    IdSchedule = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ScheduleTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScheduleStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScheduleEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScheduleStatus = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.IdSchedule);
                });

            migrationBuilder.CreateTable(
                name: "Schools",
                columns: table => new
                {
                    IdSchool = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SchoolEmail = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schools", x => x.IdSchool);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.UserId, x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Commands",
                columns: table => new
                {
                    IdCommand = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CommandName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CommandStatus = table.Column<bool>(type: "bit", nullable: false),
                    UbicacionComando = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdFundation = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Commands", x => x.IdCommand);
                    table.ForeignKey(
                        name: "FK_Commands_Fundations_IdFundation",
                        column: x => x.IdFundation,
                        principalTable: "Fundations",
                        principalColumn: "IdFundation",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    IdCourse = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CourseDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CourseHourlyIntensity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CourseEstatus = table.Column<bool>(type: "bit", nullable: false),
                    IdFundation = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.IdCourse);
                    table.ForeignKey(
                        name: "FK_Courses_Fundations_IdFundation",
                        column: x => x.IdFundation,
                        principalTable: "Fundations",
                        principalColumn: "IdFundation",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NonAttendances",
                columns: table => new
                {
                    IdNonAttendance = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdAttendance = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdReport = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NonAttendances", x => x.IdNonAttendance);
                    table.ForeignKey(
                        name: "FK_NonAttendances_Attendances_IdAttendance",
                        column: x => x.IdAttendance,
                        principalTable: "Attendances",
                        principalColumn: "IdAttendance",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NonAttendances_Reports_IdReport",
                        column: x => x.IdReport,
                        principalTable: "Reports",
                        principalColumn: "IdReport",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Brigade",
                columns: table => new
                {
                    IdBrigade = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BrigadeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrigadeLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrigadeStatus = table.Column<bool>(type: "bit", nullable: false),
                    IdCommand = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brigade", x => x.IdBrigade);
                    table.ForeignKey(
                        name: "FK_Brigade_Commands_IdCommand",
                        column: x => x.IdCommand,
                        principalTable: "Commands",
                        principalColumn: "IdCommand",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Editions",
                columns: table => new
                {
                    IdEdition = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EditionStartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EditionEndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    IdCourse = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseIdCourse = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Editions", x => x.IdEdition);
                    table.ForeignKey(
                        name: "FK_Editions_Courses_CourseIdCourse",
                        column: x => x.CourseIdCourse,
                        principalTable: "Courses",
                        principalColumn: "IdCourse",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Unit",
                columns: table => new
                {
                    IdUnit = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UnitName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitState = table.Column<bool>(type: "bit", nullable: false),
                    UnitLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdBrigade = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Unit", x => x.IdUnit);
                    table.ForeignKey(
                        name: "FK_Unit_Brigade_IdBrigade",
                        column: x => x.IdBrigade,
                        principalTable: "Brigade",
                        principalColumn: "IdBrigade",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentDateBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    StudentGender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdUnit = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdSchool = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolIdSchool = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UnitIdUnit = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.IdStudent);
                    table.ForeignKey(
                        name: "FK_Students_Schools_SchoolIdSchool",
                        column: x => x.SchoolIdSchool,
                        principalTable: "Schools",
                        principalColumn: "IdSchool",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Students_Unit_UnitIdUnit",
                        column: x => x.UnitIdUnit,
                        principalTable: "Unit",
                        principalColumn: "IdUnit",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Certificate",
                columns: table => new
                {
                    IdCertificate = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentLastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VerificationCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NameOfIssuerCert = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserDocumentNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CertificateStatus = table.Column<bool>(type: "bit", nullable: false),
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificate", x => x.IdCertificate);
                    table.ForeignKey(
                        name: "FK_Certificate_Students_IdStudent",
                        column: x => x.IdStudent,
                        principalTable: "Students",
                        principalColumn: "IdStudent",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "studentAttendances",
                columns: table => new
                {
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdAttendance = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_studentAttendances", x => new { x.IdStudent, x.IdAttendance });
                    table.ForeignKey(
                        name: "FK_studentAttendances_Attendances_IdAttendance",
                        column: x => x.IdAttendance,
                        principalTable: "Attendances",
                        principalColumn: "IdAttendance",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_studentAttendances_Students_IdStudent",
                        column: x => x.IdStudent,
                        principalTable: "Students",
                        principalColumn: "IdStudent",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentEditions",
                columns: table => new
                {
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdEdition = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentEditions", x => new { x.IdStudent, x.IdEdition });
                    table.ForeignKey(
                        name: "FK_StudentEditions_Editions_IdEdition",
                        column: x => x.IdEdition,
                        principalTable: "Editions",
                        principalColumn: "IdEdition",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentEditions_Students_IdStudent",
                        column: x => x.IdStudent,
                        principalTable: "Students",
                        principalColumn: "IdStudent",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "studentGrades",
                columns: table => new
                {
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdGrade = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_studentGrades", x => new { x.IdStudent, x.IdGrade });
                    table.ForeignKey(
                        name: "FK_studentGrades_Reports_IdGrade",
                        column: x => x.IdGrade,
                        principalTable: "Reports",
                        principalColumn: "IdReport",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_studentGrades_Students_IdStudent",
                        column: x => x.IdStudent,
                        principalTable: "Students",
                        principalColumn: "IdStudent",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "studentNonAttendances",
                columns: table => new
                {
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdNonAttendance = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_studentNonAttendances", x => new { x.IdStudent, x.IdNonAttendance });
                    table.ForeignKey(
                        name: "FK_studentNonAttendances_NonAttendances_IdNonAttendance",
                        column: x => x.IdNonAttendance,
                        principalTable: "NonAttendances",
                        principalColumn: "IdNonAttendance",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_studentNonAttendances_Students_IdStudent",
                        column: x => x.IdStudent,
                        principalTable: "Students",
                        principalColumn: "IdStudent",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "studentSchedules",
                columns: table => new
                {
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdSchedule = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_studentSchedules", x => new { x.IdStudent, x.IdSchedule });
                    table.ForeignKey(
                        name: "FK_studentSchedules_Schedules_IdSchedule",
                        column: x => x.IdSchedule,
                        principalTable: "Schedules",
                        principalColumn: "IdSchedule",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_studentSchedules_Students_IdStudent",
                        column: x => x.IdStudent,
                        principalTable: "Students",
                        principalColumn: "IdStudent",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Audits",
                columns: table => new
                {
                    IdAudit = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AuditDate = table.Column<DateOnly>(type: "date", nullable: false),
                    NameOfIssuerAudit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdCertificate = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Audits", x => x.IdAudit);
                    table.ForeignKey(
                        name: "FK_Audits_Certificate_IdCertificate",
                        column: x => x.IdCertificate,
                        principalTable: "Certificate",
                        principalColumn: "IdCertificate",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Audits_IdCertificate",
                table: "Audits",
                column: "IdCertificate",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Brigade_IdCommand",
                table: "Brigade",
                column: "IdCommand");

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_IdStudent",
                table: "Certificate",
                column: "IdStudent",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Commands_IdFundation",
                table: "Commands",
                column: "IdFundation");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_IdFundation",
                table: "Courses",
                column: "IdFundation");

            migrationBuilder.CreateIndex(
                name: "IX_Editions_CourseIdCourse",
                table: "Editions",
                column: "CourseIdCourse");

            migrationBuilder.CreateIndex(
                name: "IX_NonAttendances_IdAttendance",
                table: "NonAttendances",
                column: "IdAttendance",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NonAttendances_IdReport",
                table: "NonAttendances",
                column: "IdReport");

            migrationBuilder.CreateIndex(
                name: "IX_studentAttendances_IdAttendance",
                table: "studentAttendances",
                column: "IdAttendance");

            migrationBuilder.CreateIndex(
                name: "IX_StudentEditions_IdEdition",
                table: "StudentEditions",
                column: "IdEdition");

            migrationBuilder.CreateIndex(
                name: "IX_studentGrades_IdGrade",
                table: "studentGrades",
                column: "IdGrade");

            migrationBuilder.CreateIndex(
                name: "IX_studentNonAttendances_IdNonAttendance",
                table: "studentNonAttendances",
                column: "IdNonAttendance");

            migrationBuilder.CreateIndex(
                name: "IX_Students_SchoolIdSchool",
                table: "Students",
                column: "SchoolIdSchool");

            migrationBuilder.CreateIndex(
                name: "IX_Students_UnitIdUnit",
                table: "Students",
                column: "UnitIdUnit");

            migrationBuilder.CreateIndex(
                name: "IX_studentSchedules_IdSchedule",
                table: "studentSchedules",
                column: "IdSchedule");

            migrationBuilder.CreateIndex(
                name: "IX_Unit_IdBrigade",
                table: "Unit",
                column: "IdBrigade");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Audits");

            migrationBuilder.DropTable(
                name: "studentAttendances");

            migrationBuilder.DropTable(
                name: "StudentEditions");

            migrationBuilder.DropTable(
                name: "studentGrades");

            migrationBuilder.DropTable(
                name: "studentNonAttendances");

            migrationBuilder.DropTable(
                name: "studentSchedules");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Certificate");

            migrationBuilder.DropTable(
                name: "Editions");

            migrationBuilder.DropTable(
                name: "NonAttendances");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Attendances");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "Schools");

            migrationBuilder.DropTable(
                name: "Unit");

            migrationBuilder.DropTable(
                name: "Brigade");

            migrationBuilder.DropTable(
                name: "Commands");

            migrationBuilder.DropTable(
                name: "Fundations");
        }
    }
}
