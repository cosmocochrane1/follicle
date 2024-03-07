/*
  Warnings:

  - Made the column `original_name` on table `document_versions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `document_versions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_organization_id_fkey";

-- AlterTable
ALTER TABLE "document_versions" ALTER COLUMN "original_name" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "profile_organizations" (
    "organization_id" INTEGER NOT NULL,
    "profile_id" UUID NOT NULL,
    "scope_access" TEXT NOT NULL DEFAULT 'read',

    CONSTRAINT "profile_organizations_pkey" PRIMARY KEY ("organization_id","profile_id","scope_access")
);

-- AddForeignKey
ALTER TABLE "profile_organizations" ADD CONSTRAINT "profile_organizations_scope_access_fkey" FOREIGN KEY ("scope_access") REFERENCES "scopes"("access") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_organizations" ADD CONSTRAINT "profile_organizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profile_organizations" ADD CONSTRAINT "profile_organizations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
