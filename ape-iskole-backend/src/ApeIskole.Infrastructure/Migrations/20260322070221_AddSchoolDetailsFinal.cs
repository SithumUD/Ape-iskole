using System.Collections.Generic;
using ApeIskole.Domain.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApeIskole.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolDetailsFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Schools",
                newName: "Description");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "AcademicStreams",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "Achievements",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "ClubsAndSocieties",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<ContactInfo>(
                name: "Contact",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Schools",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<List<LeadershipMember>>(
                name: "Leadership",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "PhotoGallery",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "SchoolFacilities",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "SocialMediaUrls",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "Sponsors",
                table: "Schools",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "StartedYear",
                table: "Schools",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StudentCount",
                table: "Schools",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TeachersCount",
                table: "Schools",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Announcements",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AcademicStreams",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Achievements",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "ClubsAndSocieties",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Contact",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Leadership",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "PhotoGallery",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "SchoolFacilities",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "SocialMediaUrls",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Sponsors",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "StartedYear",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "StudentCount",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "TeachersCount",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Announcements");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Schools",
                newName: "Location");
        }
    }
}
