/* 
Migrate trigger and function manually created in supabase

  TRIGGER
    -- Name           on_profile_created
    -- Table          profiles
    -- Function       handle_new_profile
    -- Events         AFTER INSERT

  FUNCTION
    -- Name           handle_new_profile
    -- ReturnType     TRIGGER 
    -- Args           Null

    BEGIN
      INSERT INTO public.organizations (id, name, owner_id)
      VALUES (
        NEW.id,
        LOWER(NEW.email),
        NEW.id
      );
      RETURN NEW;
    END
*/

-- MIGRATION
-- DROP EXISTING TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP FUNCTION IF EXISTS handle_new_profile;

-- CREATE FUNCTION AND TRIGGER
CREATE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $on_profile_created$
  BEGIN
    INSERT INTO public.organizations (id, name, owner_id)
    VALUES (
      NEW.id,
      LOWER(NEW.email),
      NEW.id
    );
    RETURN NEW;
  END;
$on_profile_created$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
AFTER INSERT 
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION handle_new_profile();
