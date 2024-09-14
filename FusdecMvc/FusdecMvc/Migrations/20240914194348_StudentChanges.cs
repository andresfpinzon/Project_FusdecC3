using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class StudentChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "numeroDocumento",
                table: "Students",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "TipoDocumento",
                table: "Students",
                newName: "DocumentType");

            migrationBuilder.RenameColumn(
                name: "Nombre",
                table: "Students",
                newName: "DocumentNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Students",
                newName: "numeroDocumento");

            migrationBuilder.RenameColumn(
                name: "DocumentType",
                table: "Students",
                newName: "TipoDocumento");

            migrationBuilder.RenameColumn(
                name: "DocumentNumber",
                table: "Students",
                newName: "Nombre");
        }
    }
}
