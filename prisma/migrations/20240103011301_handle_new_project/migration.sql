/* 
Migrate trigger and function manually created in supabase

  TRIGGER
    -- Name           on_project_created
    -- Table          projects
    -- Function       handle_new_project
    -- Events         AFTER INSERT

  FUNCTION
    -- Name           handle_new_project
    -- ReturnType     trigger 
    -- Args           null
    -- Security       Invoker

  BEGIN
    INSERT INTO public.profile_projects (project_id, profile_id, scope_access)
    VALUES (
      NEW.id, 
      auth.uid(),
      'admin'
    );
    RETURN NEW;
  END;

*/

-- MIGRATION
-- DROP EXISTING TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS on_project_created ON public.projects;
DROP FUNCTION IF EXISTS handle_new_project;

-- CREATE FUNCTION AND TRIGGER
CREATE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_projects (project_id, profile_id, scope_access)
  VALUES (
    NEW.id, 
    auth.uid(),
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY INVOKER;

CREATE TRIGGER on_project_created
AFTER INSERT ON public.projects
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_project();
