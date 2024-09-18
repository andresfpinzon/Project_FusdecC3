using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class EliminacionReporte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Reports_IdReport",
                table: "Grades");

            migrationBuilder.DropForeignKey(
                name: "FK_NonAttendances_Reports_IdReport",
                table: "NonAttendances");

            migrationBuilder.DropIndex(
                name: "IX_NonAttendances_IdReport",
                table: "NonAttendances");

            migrationBuilder.DropIndex(
                name: "IX_Grades_IdReport",
                table: "Grades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reports",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ObservationGrade",
                table: "Grades");

            migrationBuilder.RenameTable(
                name: "Reports",
                newName: "Report");

            migrationBuilder.AddColumn<string>(
                name: "Observacion",
                table: "NonAttendances",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ReportIdReport",
                table: "Grades",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Report",
                table: "Report",
                column: "IdReport");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Report_ReportIdReport",
                table: "Grades");

            migrationBuilder.DropIndex(
                name: "IX_Grades_ReportIdReport",
                table: "Grades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Report",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "Observacion",
                table: "NonAttendances");

            migrationBuilder.DropColumn(
                name: "ReportIdReport",
                table: "Grades");

            migrationBuilder.RenameTable(
                name: "Report",
                newName: "Reports");

            migrationBuilder.AddColumn<string>(
                name: "ObservationGrade",
                table: "Grades",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reports",
                table: "Reports",
                column: "IdReport");

            migrationBuilder.CreateIndex(
                name: "IX_NonAttendances_IdReport",
                table: "NonAttendances",
                column: "IdReport");

            migrationBuilder.CreateIndex(
                name: "IX_Grades_IdReport",
                table: "Grades",
                column: "IdReport",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_Reports_IdReport",
                table: "Grades",
                column: "IdReport",
                principalTable: "Reports",
                principalColumn: "IdReport",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NonAttendances_Reports_IdReport",
                table: "NonAttendances",
                column: "IdReport",
                principalTable: "Reports",
                principalColumn: "IdReport",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
