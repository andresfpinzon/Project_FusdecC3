using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class fixSchedules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Schools_SchoolIdSchool",
                table: "Students");

            migrationBuilder.DropTable(
                name: "StudentSchedules");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolIdSchool",
                table: "Students",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "SchoolIdSchool",
                table: "Editions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "EditionSchedules",
                columns: table => new
                {
                    IdEdition = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdSchedule = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EditionSchedules", x => new { x.IdEdition, x.IdSchedule });
                    table.ForeignKey(
                        name: "FK_EditionSchedules_Editions_IdEdition",
                        column: x => x.IdEdition,
                        principalTable: "Editions",
                        principalColumn: "IdEdition",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EditionSchedules_Schedules_IdSchedule",
                        column: x => x.IdSchedule,
                        principalTable: "Schedules",
                        principalColumn: "IdSchedule",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Editions_SchoolIdSchool",
                table: "Editions",
                column: "SchoolIdSchool");

            migrationBuilder.CreateIndex(
                name: "IX_EditionSchedules_IdSchedule",
                table: "EditionSchedules",
                column: "IdSchedule");

            migrationBuilder.AddForeignKey(
                name: "FK_Editions_Schools_SchoolIdSchool",
                table: "Editions",
                column: "SchoolIdSchool",
                principalTable: "Schools",
                principalColumn: "IdSchool",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Schools_SchoolIdSchool",
                table: "Students",
                column: "SchoolIdSchool",
                principalTable: "Schools",
                principalColumn: "IdSchool");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Editions_Schools_SchoolIdSchool",
                table: "Editions");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Schools_SchoolIdSchool",
                table: "Students");

            migrationBuilder.DropTable(
                name: "EditionSchedules");

            migrationBuilder.DropIndex(
                name: "IX_Editions_SchoolIdSchool",
                table: "Editions");

            migrationBuilder.DropColumn(
                name: "SchoolIdSchool",
                table: "Editions");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolIdSchool",
                table: "Students",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "StudentSchedules",
                columns: table => new
                {
                    IdStudent = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdSchedule = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentSchedules", x => new { x.IdStudent, x.IdSchedule });
                    table.ForeignKey(
                        name: "FK_StudentSchedules_Schedules_IdSchedule",
                        column: x => x.IdSchedule,
                        principalTable: "Schedules",
                        principalColumn: "IdSchedule",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentSchedules_Students_IdStudent",
                        column: x => x.IdStudent,
                        principalTable: "Students",
                        principalColumn: "IdStudent",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentSchedules_IdSchedule",
                table: "StudentSchedules",
                column: "IdSchedule");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Schools_SchoolIdSchool",
                table: "Students",
                column: "SchoolIdSchool",
                principalTable: "Schools",
                principalColumn: "IdSchool",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
