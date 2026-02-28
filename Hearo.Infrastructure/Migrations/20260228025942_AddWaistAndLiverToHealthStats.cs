using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hearo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWaistAndLiverToHealthStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LiverStatus",
                table: "UserHealthStats",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "WaistSize",
                table: "UserHealthStats",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LiverStatus",
                table: "UserHealthStats");

            migrationBuilder.DropColumn(
                name: "WaistSize",
                table: "UserHealthStats");
        }
    }
}
