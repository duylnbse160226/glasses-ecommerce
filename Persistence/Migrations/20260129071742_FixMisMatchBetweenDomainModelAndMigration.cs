using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixMisMatchBetweenDomainModelAndMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShipmentInfos_AspNetUsers_CreatorId",
                table: "ShipmentInfos");

            migrationBuilder.DropIndex(
                name: "IX_ShipmentInfos_CreatorId",
                table: "ShipmentInfos");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "ShipmentInfos");

            migrationBuilder.AddForeignKey(
                name: "FK_ShipmentInfos_AspNetUsers_CreatedBy",
                table: "ShipmentInfos",
                column: "CreatedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShipmentInfos_AspNetUsers_CreatedBy",
                table: "ShipmentInfos");

            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "ShipmentInfos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShipmentInfos_CreatorId",
                table: "ShipmentInfos",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShipmentInfos_AspNetUsers_CreatorId",
                table: "ShipmentInfos",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
