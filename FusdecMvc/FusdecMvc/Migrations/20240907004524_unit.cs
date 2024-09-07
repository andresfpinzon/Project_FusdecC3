using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FusdecMvc.Migrations
{
    /// <inheritdoc />
    public partial class unit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_studentAttendances_Attendances_IdAttendance",
                table: "studentAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_studentAttendances_Students_IdStudent",
                table: "studentAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_studentGrades_Reports_IdGrade",
                table: "studentGrades");

            migrationBuilder.DropForeignKey(
                name: "FK_studentGrades_Students_IdStudent",
                table: "studentGrades");

            migrationBuilder.DropForeignKey(
                name: "FK_studentNonAttendances_NonAttendances_IdNonAttendance",
                table: "studentNonAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_studentNonAttendances_Students_IdStudent",
                table: "studentNonAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Unit_UnitIdUnit",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_studentSchedules_Schedules_IdSchedule",
                table: "studentSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_studentSchedules_Students_IdStudent",
                table: "studentSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Unit_Brigade_IdBrigade",
                table: "Unit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_studentSchedules",
                table: "studentSchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_studentNonAttendances",
                table: "studentNonAttendances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_studentGrades",
                table: "studentGrades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_studentAttendances",
                table: "studentAttendances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Unit",
                table: "Unit");

            migrationBuilder.RenameTable(
                name: "studentSchedules",
                newName: "StudentSchedules");

            migrationBuilder.RenameTable(
                name: "studentNonAttendances",
                newName: "StudentNonAttendances");

            migrationBuilder.RenameTable(
                name: "studentGrades",
                newName: "StudentGrades");

            migrationBuilder.RenameTable(
                name: "studentAttendances",
                newName: "StudentAttendances");

            migrationBuilder.RenameTable(
                name: "Unit",
                newName: "Units");

            migrationBuilder.RenameIndex(
                name: "IX_studentSchedules_IdSchedule",
                table: "StudentSchedules",
                newName: "IX_StudentSchedules_IdSchedule");

            migrationBuilder.RenameIndex(
                name: "IX_studentNonAttendances_IdNonAttendance",
                table: "StudentNonAttendances",
                newName: "IX_StudentNonAttendances_IdNonAttendance");

            migrationBuilder.RenameIndex(
                name: "IX_studentGrades_IdGrade",
                table: "StudentGrades",
                newName: "IX_StudentGrades_IdGrade");

            migrationBuilder.RenameIndex(
                name: "IX_studentAttendances_IdAttendance",
                table: "StudentAttendances",
                newName: "IX_StudentAttendances_IdAttendance");

            migrationBuilder.RenameIndex(
                name: "IX_Unit_IdBrigade",
                table: "Units",
                newName: "IX_Units_IdBrigade");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentSchedules",
                table: "StudentSchedules",
                columns: new[] { "IdStudent", "IdSchedule" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentNonAttendances",
                table: "StudentNonAttendances",
                columns: new[] { "IdStudent", "IdNonAttendance" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentGrades",
                table: "StudentGrades",
                columns: new[] { "IdStudent", "IdGrade" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentAttendances",
                table: "StudentAttendances",
                columns: new[] { "IdStudent", "IdAttendance" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Units",
                table: "Units",
                column: "IdUnit");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAttendances_Attendances_IdAttendance",
                table: "StudentAttendances",
                column: "IdAttendance",
                principalTable: "Attendances",
                principalColumn: "IdAttendance",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAttendances_Students_IdStudent",
                table: "StudentAttendances",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentGrades_Reports_IdGrade",
                table: "StudentGrades",
                column: "IdGrade",
                principalTable: "Reports",
                principalColumn: "IdReport",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentGrades_Students_IdStudent",
                table: "StudentGrades",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentNonAttendances_NonAttendances_IdNonAttendance",
                table: "StudentNonAttendances",
                column: "IdNonAttendance",
                principalTable: "NonAttendances",
                principalColumn: "IdNonAttendance",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentNonAttendances_Students_IdStudent",
                table: "StudentNonAttendances",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Units_UnitIdUnit",
                table: "Students",
                column: "UnitIdUnit",
                principalTable: "Units",
                principalColumn: "IdUnit",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentSchedules_Schedules_IdSchedule",
                table: "StudentSchedules",
                column: "IdSchedule",
                principalTable: "Schedules",
                principalColumn: "IdSchedule",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentSchedules_Students_IdStudent",
                table: "StudentSchedules",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Units_Brigade_IdBrigade",
                table: "Units",
                column: "IdBrigade",
                principalTable: "Brigade",
                principalColumn: "IdBrigade",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentAttendances_Attendances_IdAttendance",
                table: "StudentAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentAttendances_Students_IdStudent",
                table: "StudentAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentGrades_Reports_IdGrade",
                table: "StudentGrades");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentGrades_Students_IdStudent",
                table: "StudentGrades");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentNonAttendances_NonAttendances_IdNonAttendance",
                table: "StudentNonAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentNonAttendances_Students_IdStudent",
                table: "StudentNonAttendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Units_UnitIdUnit",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentSchedules_Schedules_IdSchedule",
                table: "StudentSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentSchedules_Students_IdStudent",
                table: "StudentSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Units_Brigade_IdBrigade",
                table: "Units");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentSchedules",
                table: "StudentSchedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentNonAttendances",
                table: "StudentNonAttendances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentGrades",
                table: "StudentGrades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentAttendances",
                table: "StudentAttendances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Units",
                table: "Units");

            migrationBuilder.RenameTable(
                name: "StudentSchedules",
                newName: "studentSchedules");

            migrationBuilder.RenameTable(
                name: "StudentNonAttendances",
                newName: "studentNonAttendances");

            migrationBuilder.RenameTable(
                name: "StudentGrades",
                newName: "studentGrades");

            migrationBuilder.RenameTable(
                name: "StudentAttendances",
                newName: "studentAttendances");

            migrationBuilder.RenameTable(
                name: "Units",
                newName: "Unit");

            migrationBuilder.RenameIndex(
                name: "IX_StudentSchedules_IdSchedule",
                table: "studentSchedules",
                newName: "IX_studentSchedules_IdSchedule");

            migrationBuilder.RenameIndex(
                name: "IX_StudentNonAttendances_IdNonAttendance",
                table: "studentNonAttendances",
                newName: "IX_studentNonAttendances_IdNonAttendance");

            migrationBuilder.RenameIndex(
                name: "IX_StudentGrades_IdGrade",
                table: "studentGrades",
                newName: "IX_studentGrades_IdGrade");

            migrationBuilder.RenameIndex(
                name: "IX_StudentAttendances_IdAttendance",
                table: "studentAttendances",
                newName: "IX_studentAttendances_IdAttendance");

            migrationBuilder.RenameIndex(
                name: "IX_Units_IdBrigade",
                table: "Unit",
                newName: "IX_Unit_IdBrigade");

            migrationBuilder.AddPrimaryKey(
                name: "PK_studentSchedules",
                table: "studentSchedules",
                columns: new[] { "IdStudent", "IdSchedule" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_studentNonAttendances",
                table: "studentNonAttendances",
                columns: new[] { "IdStudent", "IdNonAttendance" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_studentGrades",
                table: "studentGrades",
                columns: new[] { "IdStudent", "IdGrade" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_studentAttendances",
                table: "studentAttendances",
                columns: new[] { "IdStudent", "IdAttendance" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Unit",
                table: "Unit",
                column: "IdUnit");

            migrationBuilder.AddForeignKey(
                name: "FK_studentAttendances_Attendances_IdAttendance",
                table: "studentAttendances",
                column: "IdAttendance",
                principalTable: "Attendances",
                principalColumn: "IdAttendance",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_studentAttendances_Students_IdStudent",
                table: "studentAttendances",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_studentGrades_Reports_IdGrade",
                table: "studentGrades",
                column: "IdGrade",
                principalTable: "Reports",
                principalColumn: "IdReport",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_studentGrades_Students_IdStudent",
                table: "studentGrades",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_studentNonAttendances_NonAttendances_IdNonAttendance",
                table: "studentNonAttendances",
                column: "IdNonAttendance",
                principalTable: "NonAttendances",
                principalColumn: "IdNonAttendance",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_studentNonAttendances_Students_IdStudent",
                table: "studentNonAttendances",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Unit_UnitIdUnit",
                table: "Students",
                column: "UnitIdUnit",
                principalTable: "Unit",
                principalColumn: "IdUnit",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_studentSchedules_Schedules_IdSchedule",
                table: "studentSchedules",
                column: "IdSchedule",
                principalTable: "Schedules",
                principalColumn: "IdSchedule",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_studentSchedules_Students_IdStudent",
                table: "studentSchedules",
                column: "IdStudent",
                principalTable: "Students",
                principalColumn: "IdStudent",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Unit_Brigade_IdBrigade",
                table: "Unit",
                column: "IdBrigade",
                principalTable: "Brigade",
                principalColumn: "IdBrigade",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
