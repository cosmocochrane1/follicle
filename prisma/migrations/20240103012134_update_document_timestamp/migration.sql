/* 
Migrate trigger and function manually created in supabase

  TRIGGER
    -- Name           handle_document_version_updated
    -- Table          document_versions
    -- Function       update_document_timestamp
    -- Events         AFTER UPDATE

  FUNCTION
    -- Name           update_document_timestamp
    -- ReturnType     null
    -- Args           trigger
    -- Security       Invoker	

    BEGIN
      UPDATE documents SET updated_at = NOW() WHERE id = NEW.document_id;
      RETURN NEW;
    END;
*/

-- MIGRATION
-- DROP EXISTING TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS handle_document_version_updated ON public.document_versions;
DROP FUNCTION IF EXISTS update_document_timestamp;

-- CREATE FUNCTION AND TRIGGER
CREATE FUNCTION public.update_document_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE documents SET updated_at = NOW() WHERE id = NEW.document_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY INVOKER;

CREATE TRIGGER handle_document_version_updated
AFTER UPDATE ON public.document_versions
FOR EACH ROW EXECUTE PROCEDURE public.update_document_timestamp();
