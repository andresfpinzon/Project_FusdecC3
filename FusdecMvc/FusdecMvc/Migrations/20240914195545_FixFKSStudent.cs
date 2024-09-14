using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class FixFKSStudent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Editions_Schools_SchoolIdSchool",
                table: "Editions");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Schools_SchoolIdSchool",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Units_UnitIdUnit",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_SchoolIdSchool",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_UnitIdUnit",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Editions_SchoolIdSchool",
                table: "Editions");

            migrationBuilder.DropColumn(
                name: "SchoolIdSchool",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "UnitIdUnit",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "SchoolIdSchool",
                table: "Editions");

            migrationBuilder.CreateIndex(
                name: "IX_Students_IdSchool",
                table: "Students",
                column: "IdSchool");

            migrationBuilder.CreateIndex(
                name: "IX_Students_IdUnit",
                table: "Students",
                column: "IdUnit");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Schools_IdSchool",
                table: "Students",
                column: "IdSchool",
                principalTable: "Schools",
                principalColumn: "IdSchool",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Units_IdUnit",
                table: "Students",
                column: "IdUnit",
                principalTable: "Units",
                principalColumn: "IdUnit",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Schools_IdSchool",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Units_IdUnit",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_IdSchool",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_IdUnit",
                table: "Students");

            migrationBuilder.AddColumn<Guid>(
                name: "SchoolIdSchool",
                table: "Students",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UnitIdUnit",
                table: "Students",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "SchoolIdSchool",
                table: "Editions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Students_SchoolIdSchool",
                table: "Students",
                column: "SchoolIdSchool");

            migrationBuilder.CreateIndex(
                name: "IX_Students_UnitIdUnit",
                table: "Students",
                column: "UnitIdUnit");

            migrationBuilder.CreateIndex(
                name: "IX_Editions_SchoolIdSchool",
                table: "Editions",
                column: "SchoolIdSchool");

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
                principalColumn: "IdSchool",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Units_UnitIdUnit",
                table: "Students",
                column: "UnitIdUnit",
                principalTable: "Units",
                principalColumn: "IdUnit",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
