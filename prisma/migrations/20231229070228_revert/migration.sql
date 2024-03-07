/*
  Warnings:

  - You are about to drop the column `preview_url` on the `document_versions` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_url` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `preview_urls` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `profile_teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_team_id_fkey";

-- DropForeignKey
ALTER TABLE "profile_teams" DROP CONSTRAINT "profile_teams_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "profile_teams" DROP CONSTRAINT "profile_teams_scope_access_fkey";

-- DropForeignKey
ALTER TABLE "profile_teams" DROP CONSTRAINT "profile_teams_team_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_team_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_organization_id_fkey";

-- AlterTable
ALTER TABLE "document_versions" DROP COLUMN "preview_url",
ADD COLUMN     "thumbnail_url" TEXT;

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "team_id",
ADD COLUMN     "preview_urls" TEXT[];

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "thumbnail_url";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "preview_urls",
DROP COLUMN "team_id";

-- DropTable
DROP TABLE "profile_teams";

-- DropTable
DROP TABLE "teams";
