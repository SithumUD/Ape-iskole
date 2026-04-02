using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApeIskole.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddDonationsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_Schools_SchoolId",
                table: "Announcements");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolId",
                table: "Announcements",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "Announcements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledAt",
                table: "Announcements",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Announcements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<List<Guid>>(
                name: "TargetSchoolIds",
                table: "Announcements",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "Views",
                table: "Announcements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_Schools_SchoolId",
                table: "Announcements",
                column: "SchoolId",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_Schools_SchoolId",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "ScheduledAt",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "TargetSchoolIds",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "Views",
                table: "Announcements");

            migrationBuilder.AlterColumn<Guid>(
                name: "SchoolId",
                table: "Announcements",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_Schools_SchoolId",
                table: "Announcements",
                column: "SchoolId",
                principalTable: "Schools",
                principalColumn: "Id");
        }
    }
}
