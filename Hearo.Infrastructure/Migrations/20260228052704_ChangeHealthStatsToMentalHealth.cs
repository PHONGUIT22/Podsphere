using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hearo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeHealthStatsToMentalHealth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "UserHealthStats");

            migrationBuilder.DropColumn(
                name: "WaistCircumference",
                table: "UserHealthStats");

            migrationBuilder.DropColumn(
                name: "WaistSize",
                table: "UserHealthStats");

            migrationBuilder.RenameColumn(
                name: "Weight",
                table: "UserHealthStats",
                newName: "SleepHours");

            migrationBuilder.RenameColumn(
                name: "LiverStatus",
                table: "UserHealthStats",
                newName: "StressLevel");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "UserHealthStats",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MoodScore",
                table: "UserHealthStats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "UserHealthStats",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoodScore",
                table: "UserHealthStats");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "UserHealthStats");

            migrationBuilder.RenameColumn(
                name: "StressLevel",
                table: "UserHealthStats",
                newName: "LiverStatus");

            migrationBuilder.RenameColumn(
                name: "SleepHours",
                table: "UserHealthStats",
                newName: "Weight");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "UserHealthStats",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<double>(
                name: "Height",
                table: "UserHealthStats",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "WaistCircumference",
                table: "UserHealthStats",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "WaistSize",
                table: "UserHealthStats",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
