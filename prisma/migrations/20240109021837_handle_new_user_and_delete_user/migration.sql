-- For shadow database agreement
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users ( id uuid NOT NULL );

DO $$
  BEGIN
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $BODY$
      SELECT
        coalesce(
          nullif(current_setting('request.jwt.claim.sub', true), ''),
          (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
        )::uuid
    $BODY$;
  EXCEPTION
    WHEN duplicate_function THEN NULL;
  END;
$$;

-- Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile." ON profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile." ON profiles
  FOR DELETE USING (auth.uid() = id);


-- DROP EXISTING TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_user_deleted ON public.profiles;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, username, full_name, avatar_url, email)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'email', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE function public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users where id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE TRIGGER on_profile_user_deleted
AFTER DELETE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.handle_user_delete();
