using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApeIskole.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDonationImpactAndDraftStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Impact",
                table: "Donations");

            migrationBuilder.AddColumn<List<string>>(
                name: "ImpactStatements",
                table: "Donations",
                type: "text[]",
                nullable: false,
                defaultValueSql: "'{}'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImpactStatements",
                table: "Donations");

            migrationBuilder.AddColumn<string>(
                name: "Impact",
                table: "Donations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
