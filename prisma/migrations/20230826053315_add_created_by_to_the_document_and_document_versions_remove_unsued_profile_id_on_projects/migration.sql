/*
  Warnings:

  - You are about to drop the column `main_version_id` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `projects` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `document_versions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_versions" ADD COLUMN     "created_by" UUID NOT NULL,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "main_version_id",
ADD COLUMN     "created_by" UUID NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "profile_id",
ADD COLUMN     "created_by" UUID NOT NULL;
