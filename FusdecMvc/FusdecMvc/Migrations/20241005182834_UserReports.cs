using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class UserReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "NonAttendances",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Grades",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Attendances",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_NonAttendances_UserId",
                table: "NonAttendances",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Grades_UserId",
                table: "Grades",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_UserId",
                table: "Attendances",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_AspNetUsers_UserId",
                table: "Attendances",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_AspNetUsers_UserId",
                table: "Grades",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NonAttendances_AspNetUsers_UserId",
                table: "NonAttendances",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_AspNetUsers_UserId",
                table: "Attendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Grades_AspNetUsers_UserId",
                table: "Grades");

            migrationBuilder.DropForeignKey(
                name: "FK_NonAttendances_AspNetUsers_UserId",
                table: "NonAttendances");

            migrationBuilder.DropIndex(
                name: "IX_NonAttendances_UserId",
                table: "NonAttendances");

            migrationBuilder.DropIndex(
                name: "IX_Grades_UserId",
                table: "Grades");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_UserId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "NonAttendances");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Attendances");
        }
    }
}
