using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VolanGo.Migrations
{
    /// <inheritdoc />
    public partial class NumberOfDaysUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "number_of_days",
                table: "reservationDetails",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "number_of_days",
                table: "reservationDetails");
        }
    }
}
