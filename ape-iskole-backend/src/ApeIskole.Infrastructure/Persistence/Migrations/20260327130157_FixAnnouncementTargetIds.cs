using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApeIskole.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixAnnouncementTargetIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the old jsonb column and recreate it as a native uuid[] array
            migrationBuilder.DropColumn(
                name: "TargetSchoolIds",
                table: "Announcements");

            migrationBuilder.AddColumn<Guid[]>(
                name: "TargetSchoolIds",
                table: "Announcements",
                type: "uuid[]",
                nullable: false,
                defaultValue: new Guid[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<Guid>>(
                name: "TargetSchoolIds",
                table: "Announcements",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]");
        }
    }
}
