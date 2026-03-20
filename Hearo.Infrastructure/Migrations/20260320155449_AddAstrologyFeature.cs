using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hearo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAstrologyFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AstrologyProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsMale = table.Column<bool>(type: "bit", nullable: false),
                    SolarBirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BirthTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    IsPrimaryProfile = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AstrologyProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AstrologyProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DailyAstrologyInsights",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TargetDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DailyEnergy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InsightMessage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecommendedPodcastId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    RecommendedMeditationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyAstrologyInsights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyAstrologyInsights_Meditations_RecommendedMeditationId",
                        column: x => x.RecommendedMeditationId,
                        principalTable: "Meditations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DailyAstrologyInsights_Podcasts_RecommendedPodcastId",
                        column: x => x.RecommendedPodcastId,
                        principalTable: "Podcasts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DailyAstrologyInsights_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IChingDivinations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Method = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OriginalHexagram = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MutatedHexagram = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NuclearHexagram = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AIAnalysis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IChingDivinations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IChingDivinations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BaziCharts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YearPillar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MonthPillar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DayPillar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HourPillar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FavorableElements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MissingElements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DayMasterStrength = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChartDataJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaziCharts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BaziCharts_AstrologyProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "AstrologyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TuViCharts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DestinyElement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LifePalacePosition = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MainStarsInDestiny = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TwelvePalacesJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TuViCharts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TuViCharts_AstrologyProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "AstrologyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AstrologyProfiles_UserId",
                table: "AstrologyProfiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BaziCharts_ProfileId",
                table: "BaziCharts",
                column: "ProfileId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DailyAstrologyInsights_RecommendedMeditationId",
                table: "DailyAstrologyInsights",
                column: "RecommendedMeditationId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyAstrologyInsights_RecommendedPodcastId",
                table: "DailyAstrologyInsights",
                column: "RecommendedPodcastId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyAstrologyInsights_UserId",
                table: "DailyAstrologyInsights",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_IChingDivinations_UserId",
                table: "IChingDivinations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TuViCharts_ProfileId",
                table: "TuViCharts",
                column: "ProfileId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaziCharts");

            migrationBuilder.DropTable(
                name: "DailyAstrologyInsights");

            migrationBuilder.DropTable(
                name: "IChingDivinations");

            migrationBuilder.DropTable(
                name: "TuViCharts");

            migrationBuilder.DropTable(
                name: "AstrologyProfiles");
        }
    }
}
