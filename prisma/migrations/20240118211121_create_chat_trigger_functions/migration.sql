-- MAKE FKs INITIALLY DEFERRED
ALTER TABLE "projects" DROP CONSTRAINT "projects_chatroom_id_fkey";
ALTER TABLE "documents" DROP CONSTRAINT "documents_chatroom_id_fkey";

ALTER TABLE "projects" 
ADD CONSTRAINT "projects_chatroom_id_fkey" 
FOREIGN KEY ("chatroom_id") REFERENCES "chatrooms"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE 
DEFERRABLE INITIALLY DEFERRED
;

ALTER TABLE "documents" 
ADD CONSTRAINT "documents_chatroom_id_fkey" 
FOREIGN KEY ("chatroom_id") 
REFERENCES "chatrooms"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE 
DEFERRABLE INITIALLY DEFERRED
;


-- Set Default Valies for chatroom_id
ALTER TABLE "projects" ALTER COLUMN "chatroom_id" SET DEFAULT gen_random_uuid();
ALTER TABLE "documents" ALTER COLUMN "chatroom_id" SET DEFAULT gen_random_uuid();

-- Trigger functions for chat

DROP TRIGGER IF EXISTS  on_project_created_chat          ON public.projects          ;
DROP TRIGGER IF EXISTS  on_document_created_chat         ON public.documents         ;
DROP TRIGGER IF EXISTS  on_profile_project_created_chat  ON public.profile_projects  ;
DROP TRIGGER IF EXISTS  on_profile_document_created_chat ON public.profile_documents ;
DROP TRIGGER IF EXISTS  on_message_created               ON public.messages          ;
DROP TRIGGER IF EXISTS  on_update_project_name_chat      ON public.projects          ;
DROP TRIGGER IF EXISTS  on_update_document_name_chat     ON public.documents         ;

DROP FUNCTION IF EXISTS public.handle_new_project_chat            ;
DROP FUNCTION IF EXISTS public.handle_new_document_chat           ;
DROP FUNCTION IF EXISTS public.handle_new_profile_projects_chat   ;
DROP FUNCTION IF EXISTS public.handle_new_profile_documents_chat  ;
DROP FUNCTION IF EXISTS public.handle_new_message_unread          ;
DROP FUNCTION IF EXISTS public.handle_update_project_name_chat    ;
DROP FUNCTION IF EXISTS public.handle_update_document_name_chat   ;

-- WHEN CREATE PROJECT
-- THEN CREATE CHATROOM
CREATE FUNCTION public.handle_new_project_chat()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.chatrooms ("id", "name")
  VALUES (
    NEW.chatroom_id, 
    NEW.name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
;

CREATE TRIGGER on_project_created_chat
BEFORE INSERT ON public.projects
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_project_chat()
;

-- WHEN CREATE DOCUMENT
-- THEN CREATE CHATROOM
CREATE FUNCTION public.handle_new_document_chat()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.chatrooms ("id", "name")
  VALUES (
    NEW.chatroom_id, 
    NEW.name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
;

CREATE TRIGGER on_document_created_chat
BEFORE INSERT ON public.documents
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_document_chat()
;

-- WHEN CREATE PROFILE_PROJECT
-- THEN CREATE PROFILE_CHATROOM
CREATE FUNCTION public.handle_new_profile_projects_chat()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_chatrooms ("profile_id", "chatroom_id")
  SELECT profile_projects.profile_id, projects.chatroom_id 
  FROM profile_projects
  LEFT JOIN projects ON projects.id = profile_projects.project_id
  WHERE profile_id = NEW.profile_id
  AND project_id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
;

CREATE TRIGGER on_profile_project_created_chat
AFTER INSERT ON public.profile_projects
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_profile_projects_chat()
;

-- WHEN CREATE PROFILE_DOCUMENT
-- THEN CREATE PROFILE_CHATROOM
CREATE FUNCTION public.handle_new_profile_documents_chat()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_chatrooms ("profile_id", "chatroom_id")
  SELECT profile_documents.profile_id, documents.chatroom_id 
  FROM profile_documents
  LEFT JOIN documents ON documents.id = profile_documents.document_id
  WHERE profile_id = NEW.profile_id
  AND document_id = NEW.document_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
;

CREATE TRIGGER on_profile_document_created_chat
AFTER INSERT ON public.profile_documents
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_profile_documents_chat()
;

-- WHEN CREATE MESSAGE
-- THEN CREATE UNREAD_CHATROOMS
---- only if 
------ profile_id, chatroom_id combo is not already in unread_chatrooms
------ profile_id is not message sender's id
CREATE FUNCTION public.handle_new_message_unread()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.unread_chatrooms ("chatroom_id", "profile_id")
  SELECT pc.chatroom_id, pc.profile_id
  FROM profile_chatrooms pc
  LEFT JOIN unread_chatrooms uc 
    ON pc.profile_id = uc.profile_id 
    AND pc.chatroom_id = uc.chatroom_id
  WHERE
    -- profile_id, chatroom_id combo is not already in unread_chatrooms
    uc.profile_id IS NULL
    -- chatroom_id matches sent message
    AND pc.chatroom_id = NEW.chatroom_id
    -- profile_id is not message sender's id
    AND pc.profile_id != NEW.sender_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
;

CREATE TRIGGER on_message_created
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_message_unread()
;

-- WHEN PROJECT NAME  CHANGES 
-- THEN CHATROOM NAME CHANGES
CREATE FUNCTION public.handle_update_project_name_chat()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chatrooms
  SET "name" = NEW.name
  WHERE id = NEW.chatroom_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
;

CREATE TRIGGER on_update_project_name_chat 
AFTER UPDATE OF "name" ON public.projects
FOR EACH ROW EXECUTE PROCEDURE public.handle_update_project_name_chat()
;

-- WHEN DOCUMENT NAME  CHANGES 
-- THEN CHATROOM NAME CHANGES
CREATE FUNCTION public.handle_update_document_name_chat()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chatrooms
  SET "name" = NEW.name
  WHERE id = NEW.chatroom_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
;

CREATE TRIGGER on_update_document_name_chat 
AFTER UPDATE OF "name" ON public.documents
FOR EACH ROW EXECUTE PROCEDURE public.handle_update_document_name_chat()
;
