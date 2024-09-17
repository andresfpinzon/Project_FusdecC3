using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class editionFkCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Editions_Courses_CourseIdCourse",
                table: "Editions");

            migrationBuilder.DropIndex(
                name: "IX_Editions_CourseIdCourse",
                table: "Editions");

            migrationBuilder.DropColumn(
                name: "CourseIdCourse",
                table: "Editions");

            migrationBuilder.CreateIndex(
                name: "IX_Editions_IdCourse",
                table: "Editions",
                column: "IdCourse");

            migrationBuilder.AddForeignKey(
                name: "FK_Editions_Courses_IdCourse",
                table: "Editions",
                column: "IdCourse",
                principalTable: "Courses",
                principalColumn: "IdCourse",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Editions_Courses_IdCourse",
                table: "Editions");

            migrationBuilder.DropIndex(
                name: "IX_Editions_IdCourse",
                table: "Editions");

            migrationBuilder.AddColumn<Guid>(
                name: "CourseIdCourse",
                table: "Editions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Editions_CourseIdCourse",
                table: "Editions",
                column: "CourseIdCourse");

            migrationBuilder.AddForeignKey(
                name: "FK_Editions_Courses_CourseIdCourse",
                table: "Editions",
                column: "CourseIdCourse",
                principalTable: "Courses",
                principalColumn: "IdCourse",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
