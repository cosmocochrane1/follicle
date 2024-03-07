/*
  Warnings:

  - The primary key for the `profile_documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `profile_organizations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `profile_projects` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "profile_documents" DROP CONSTRAINT "profile_documents_pkey",
ADD CONSTRAINT "profile_documents_pkey" PRIMARY KEY ("document_id", "profile_id");

-- AlterTable
ALTER TABLE "profile_organizations" DROP CONSTRAINT "profile_organizations_pkey",
ADD CONSTRAINT "profile_organizations_pkey" PRIMARY KEY ("organization_id", "profile_id");

-- AlterTable
ALTER TABLE "profile_projects" DROP CONSTRAINT "profile_projects_pkey",
ADD CONSTRAINT "profile_projects_pkey" PRIMARY KEY ("project_id", "profile_id");
