using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class CambioEstudiantes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CourseName",
                table: "Certificate");

            migrationBuilder.DropColumn(
                name: "StudentLastName",
                table: "Certificate");

            migrationBuilder.DropColumn(
                name: "StudentName",
                table: "Certificate");

            migrationBuilder.DropColumn(
                name: "UserDocumentNumber",
                table: "Certificate");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Students",
                newName: "StudentName");

            migrationBuilder.AddColumn<string>(
                name: "StudentLastName",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "IdCourse",
                table: "Certificate",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_IdCourse",
                table: "Certificate",
                column: "IdCourse");

            migrationBuilder.AddForeignKey(
                name: "FK_Certificate_Courses_IdCourse",
                table: "Certificate",
                column: "IdCourse",
                principalTable: "Courses",
                principalColumn: "IdCourse",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certificate_Courses_IdCourse",
                table: "Certificate");

            migrationBuilder.DropIndex(
                name: "IX_Certificate_IdCourse",
                table: "Certificate");

            migrationBuilder.DropColumn(
                name: "StudentLastName",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "IdCourse",
                table: "Certificate");

            migrationBuilder.RenameColumn(
                name: "StudentName",
                table: "Students",
                newName: "Name");

            migrationBuilder.AddColumn<string>(
                name: "CourseName",
                table: "Certificate",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudentLastName",
                table: "Certificate",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudentName",
                table: "Certificate",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserDocumentNumber",
                table: "Certificate",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
