using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class EstudianteListaCertificados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Certificate_IdStudent",
                table: "Certificate");

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_IdStudent",
                table: "Certificate",
                column: "IdStudent");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Certificate_IdStudent",
                table: "Certificate");

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_IdStudent",
                table: "Certificate",
                column: "IdStudent",
                unique: true);
        }
    }
}
