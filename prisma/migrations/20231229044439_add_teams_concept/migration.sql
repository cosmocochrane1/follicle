-- AlterTable
ALTER TABLE "document_versions" ADD COLUMN     "preview_url" TEXT;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "team_id" UUID,
ADD COLUMN     "thumbnail_url" TEXT;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "thumbnail_url" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "preview_urls" TEXT[],
ADD COLUMN     "thumbnail_url" TEXT;

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "thumbnail_url" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_teams" (
    "team_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "scope_access" TEXT NOT NULL DEFAULT 'read',

    CONSTRAINT "profile_teams_pkey" PRIMARY KEY ("team_id","profile_id","scope_access")
);

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_teams" ADD CONSTRAINT "profile_teams_scope_access_fkey" FOREIGN KEY ("scope_access") REFERENCES "scopes"("access") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_teams" ADD CONSTRAINT "profile_teams_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profile_teams" ADD CONSTRAINT "profile_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
