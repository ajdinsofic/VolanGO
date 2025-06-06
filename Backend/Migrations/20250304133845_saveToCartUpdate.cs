﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VolanGo.Migrations
{
    /// <inheritdoc />
    public partial class saveToCartUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "locationId",
                table: "saveToCarts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "locationId",
                table: "saveToCarts");
        }
    }
}
