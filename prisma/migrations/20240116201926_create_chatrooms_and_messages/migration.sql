/*
  Warnings:

  - A unique constraint covering the columns `[chatroom_id]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chatroom_id]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatroom_id` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatroom_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN   "chatroom_id" UUID;

-- AlterTable
ALTER TABLE "projects"  ADD COLUMN   "chatroom_id" UUID;

---- Update rows in "documents" / "projects" to have a chatroom_id
UPDATE "documents"      SET "chatroom_id" = id;
UPDATE "projects"       SET "chatroom_id" = id;

---- Update columns in "documents" / "projects" set NOT NULL
ALTER TABLE "documents" ALTER COLUMN "chatroom_id" SET NOT NULL;
ALTER TABLE "projects"  ALTER COLUMN "chatroom_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "chatrooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatrooms_pkey" PRIMARY KEY ("id")
);

---- Insert records into chatrooms for each row in "documents" and "projects"
---- Note: chatroom ids match document_id or project_id for these records but that is not a FK rel
INSERT INTO chatrooms ("id", "name")
  SELECT "id", "name" FROM public.documents
  UNION ALL 
  SELECT "id", "name" FROM public.projects
;

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL DEFAULT 'text',
    "content" TEXT NOT NULL,
    "sender_id" UUID NOT NULL,
    "chatroom_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_chatrooms" (
    "chatroom_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_chatrooms_pkey" PRIMARY KEY ("chatroom_id","profile_id")
);

---- Insert records into profile_chatrooms from "profile_documents" and "profile_projects"
INSERT INTO profile_chatrooms ("chatroom_id", "profile_id")
  SELECT "document_id", "profile_id" FROM profile_documents
  UNION ALL
  SELECT "project_id", "profile_id" FROM profile_projects
;

-- CreateTable
CREATE TABLE "unread_chatrooms" (
    "profile_id" UUID NOT NULL,
    "chatroom_id" UUID NOT NULL,

    CONSTRAINT "unread_chatrooms_pkey" PRIMARY KEY ("profile_id","chatroom_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_chatroom_id_key" ON "documents"("chatroom_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_chatroom_id_key" ON "projects"("chatroom_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "chatrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_chatrooms" ADD CONSTRAINT "profile_chatrooms_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_chatrooms" ADD CONSTRAINT "profile_chatrooms_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "chatrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unread_chatrooms" ADD CONSTRAINT "unread_chatrooms_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unread_chatrooms" ADD CONSTRAINT "unread_chatrooms_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
