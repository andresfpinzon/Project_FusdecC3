using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class Grade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentGrades_Reports_IdGrade",
                table: "StudentGrades");

            migrationBuilder.DropColumn(
                name: "Approved",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ObservationGrade",
                table: "Reports");

            migrationBuilder.CreateTable(
                name: "Grades",
                columns: table => new
                {
                    IdGrade = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdReport = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Approved = table.Column<bool>(type: "bit", nullable: false),
                    ObservationGrade = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grades", x => x.IdGrade);
                    table.ForeignKey(
                        name: "FK_Grades_Reports_IdReport",
                        column: x => x.IdReport,
                        principalTable: "Reports",
                        principalColumn: "IdReport",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Grades_IdReport",
                table: "Grades",
                column: "IdReport",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentGrades_Grades_IdGrade",
                table: "StudentGrades",
                column: "IdGrade",
                principalTable: "Grades",
                principalColumn: "IdGrade",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentGrades_Grades_IdGrade",
                table: "StudentGrades");

            migrationBuilder.DropTable(
                name: "Grades");

            migrationBuilder.AddColumn<bool>(
                name: "Approved",
                table: "Reports",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Reports",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ObservationGrade",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentGrades_Reports_IdGrade",
                table: "StudentGrades",
                column: "IdGrade",
                principalTable: "Reports",
                principalColumn: "IdReport",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
