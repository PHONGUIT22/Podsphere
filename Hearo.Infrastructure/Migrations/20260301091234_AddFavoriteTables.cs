using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hearo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoriteTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserFavoriteMeditations",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MeditationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFavoriteMeditations", x => new { x.UserId, x.MeditationId });
                    table.ForeignKey(
                        name: "FK_UserFavoriteMeditations_Meditations_MeditationId",
                        column: x => x.MeditationId,
                        principalTable: "Meditations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFavoriteMeditations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFavoritePodcasts",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PodcastId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFavoritePodcasts", x => new { x.UserId, x.PodcastId });
                    table.ForeignKey(
                        name: "FK_UserFavoritePodcasts_Podcasts_PodcastId",
                        column: x => x.PodcastId,
                        principalTable: "Podcasts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFavoritePodcasts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserFavoriteMeditations_MeditationId",
                table: "UserFavoriteMeditations",
                column: "MeditationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFavoritePodcasts_PodcastId",
                table: "UserFavoritePodcasts",
                column: "PodcastId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserFavoriteMeditations");

            migrationBuilder.DropTable(
                name: "UserFavoritePodcasts");
        }
    }
}
