using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VolanGo.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUSERID2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Users_UserId",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Reservations",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "IX_Reservations_UserId",
                table: "Reservations",
                newName: "IX_Reservations_user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Users_user_id",
                table: "Reservations",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Users_user_id",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Reservations",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reservations_user_id",
                table: "Reservations",
                newName: "IX_Reservations_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Users_UserId",
                table: "Reservations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
