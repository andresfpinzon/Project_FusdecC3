using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class EliminacionDeCodigoReporte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Report_ReportIdReport",
                table: "Grades");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropIndex(
                name: "IX_Grades_ReportIdReport",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "IdReport",
                table: "NonAttendances");

            migrationBuilder.DropColumn(
                name: "IdReport",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "ReportIdReport",
                table: "Grades");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Editions",
                newName: "EditionTitle");

            migrationBuilder.AddColumn<string>(
                name: "NonAttendanceTitle",
                table: "NonAttendances",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GradeTitle",
                table: "Grades",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NonAttendanceTitle",
                table: "NonAttendances");

            migrationBuilder.DropColumn(
                name: "GradeTitle",
                table: "Grades");

            migrationBuilder.RenameColumn(
                name: "EditionTitle",
                table: "Editions",
                newName: "Title");

            migrationBuilder.AddColumn<Guid>(
                name: "IdReport",
                table: "NonAttendances",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "IdReport",
                table: "Grades",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ReportIdReport",
                table: "Grades",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    IdReport = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Observation = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.IdReport);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Grades_ReportIdReport",
                table: "Grades",
                column: "ReportIdReport");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_Report_ReportIdReport",
                table: "Grades",
                column: "ReportIdReport",
                principalTable: "Report",
                principalColumn: "IdReport",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
