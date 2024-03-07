/*
  Warnings:

  - The primary key for the `profile_documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permissions` on the `profile_documents` table. All the data in the column will be lost.
  - The primary key for the `profile_projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permissions` on the `profile_projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile_documents" DROP CONSTRAINT "profile_documents_pkey",
DROP COLUMN "permissions",
ADD COLUMN     "scope_access" TEXT NOT NULL DEFAULT 'read',
ADD CONSTRAINT "profile_documents_pkey" PRIMARY KEY ("document_id", "profile_id", "scope_access");

-- AlterTable
ALTER TABLE "profile_projects" DROP CONSTRAINT "profile_projects_pkey",
DROP COLUMN "permissions",
ADD COLUMN     "scope_access" TEXT NOT NULL DEFAULT 'read',
ADD CONSTRAINT "profile_projects_pkey" PRIMARY KEY ("project_id", "profile_id", "scope_access");

-- DropEnum
DROP TYPE "permissions";

-- CreateTable
CREATE TABLE "scopes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "access" TEXT NOT NULL DEFAULT 'read',
    "description" TEXT,

    CONSTRAINT "scopes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scopes_access_key" ON "scopes"("access");

-- AddForeignKey
ALTER TABLE "profile_projects" ADD CONSTRAINT "profile_projects_scope_access_fkey" FOREIGN KEY ("scope_access") REFERENCES "scopes"("access") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_documents" ADD CONSTRAINT "profile_documents_scope_access_fkey" FOREIGN KEY ("scope_access") REFERENCES "scopes"("access") ON DELETE RESTRICT ON UPDATE CASCADE;
