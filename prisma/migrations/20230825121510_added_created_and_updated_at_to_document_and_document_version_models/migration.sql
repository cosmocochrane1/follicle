/*
  Warnings:

  - Made the column `created_at` on table `document_versions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `document_versions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "document_versions" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
