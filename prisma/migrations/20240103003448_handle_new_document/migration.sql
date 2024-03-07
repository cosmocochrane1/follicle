/* 
Migrate trigger and function manually created in supabase

  TRIGGER
    -- Name           on_document_created
    -- Table          documents
    -- Function       handle_new_document
    -- Events         AFTER INSERT

  FUNCTION
    -- Name           handle_new_document
    -- ReturnType     TRIGGER 
    -- Args           Null
    -- SECURITY       Invoker

  BEGIN
    INSERT INTO public.profile_documents (document_id, profile_id, scope_access)
    VALUES (
      NEW.id, 
      auth.uid(),
      'admin'
    );
    RETURN NEW;
  END;

*/

-- MIGRATION
DROP TRIGGER IF EXISTS on_document_created ON public.documents;
DROP FUNCTION IF EXISTS handle_new_document;

-- Trigger Function for Document Created
CREATE FUNCTION public.handle_new_document()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_documents (document_id, profile_id, scope_access)
  VALUES (
    NEW.id, 
    auth.uid(),
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER;

-- Trigger for Document Created
CREATE TRIGGER on_document_created
AFTER INSERT ON public.documents
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_document();
