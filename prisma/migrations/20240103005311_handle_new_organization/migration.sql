/* 
Migrate trigger and function manually created in supabase

  TRIGGER
    -- Name           on_organization_created
    -- Table          organizations
    -- Function       handle_new_organization
    -- Events         AFTER INSERT

  FUNCTION
    -- Name           handle_new_organization
    -- ReturnType     TRIGGER 
    -- Args           Null

  BEGIN
    INSERT INTO public.profile_organizations (organization_id, profile_id, scope_access)
    VALUES (
      NEW.id, 
      COALESCE(auth.uid(), NEW.id),
      'admin'
    );
    RETURN NEW;
  END;

*/

-- MIGRATION
-- DROP EXISTING TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS on_organization_created ON public.organizations;
DROP FUNCTION IF EXISTS handle_new_organization;

-- CREATE FUNCTION AND TRIGGER
CREATE FUNCTION public.handle_new_organization()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_organizations (organization_id, profile_id, scope_access)
  VALUES (
    NEW.id, 
    COALESCE(auth.uid(), NEW.id),
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY INVOKER;

CREATE TRIGGER on_organization_created
AFTER INSERT ON public.organizations
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_organization();
