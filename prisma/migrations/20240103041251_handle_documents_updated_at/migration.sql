/* 
MODDATETIME TRIGGERS FOR DOCUMENT UPDATES

  -- Name:      handle_documents_updated_at
  -- Table:     documents
  -- Function:  moddatetime
  -- Events:    BEFORE UPDATE

  -- Name:      handle_document_version_updated_at
  -- Table:     document_versions
  -- Function:  moddatetime
  -- Events:    BEFORE UPDATE
*/

-- Enable moddatetime extension
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- set the `updated_at` column on every update
CREATE OR REPLACE TRIGGER handle_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

CREATE OR REPLACE TRIGGER handle_document_version_updated_at BEFORE UPDATE ON public.document_versions
  FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
