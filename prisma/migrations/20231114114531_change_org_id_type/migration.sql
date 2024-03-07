/*
  Warnings:

  - The primary key for the `organizations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `organizations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `profile_organizations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `organization_id` on the `documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organization_id` on the `profile_organizations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organization_id` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "profile_organizations" DROP CONSTRAINT "profile_organizations_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organization_id_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "organization_id",
ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "profile_organizations" DROP CONSTRAINT "profile_organizations_pkey",
DROP COLUMN "organization_id",
ADD COLUMN     "organization_id" UUID NOT NULL,
ADD CONSTRAINT "profile_organizations_pkey" PRIMARY KEY ("organization_id", "profile_id", "scope_access");

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "organization_id",
ADD COLUMN     "organization_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_organizations" ADD CONSTRAINT "profile_organizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
