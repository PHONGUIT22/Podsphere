using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hearo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddThumbnailAndDescriptionToMeditation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Meditations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Meditations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Meditations");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Meditations");
        }
    }
}
