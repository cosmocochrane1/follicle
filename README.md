# Ijin Project

Welcome to the Ijin Project! This guide will help you set up your development environment and go through some of the important aspects of the project, including Prisma setup and known issues.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Prisma Configuration](#prisma-configuration)
3. [Known Issues with Prisma](#known-issues-with-prisma)
4. [Functions](#functions)

---

## Getting Started

To get started, you'll need to run the development server. Use one of the following commands:

```bash 
yarn dev
```

After running the server, open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Prisma Configuration

We use Prisma connected to Supabase. If you make changes to the `schema.prisma` file, make sure to run the following command:

```bash
yarn run migrate-dev
```

---

## Known Issues with Prisma

**⚠️ Important: If in any doubt, contact Komang!**

- **Missing Grants**: If your database schema is out of sync with your migration history, you may encounter issues. [Official Prisma Integration Known Issue](https://supabase.com/partners/integrations/prisma).

- **Database Reset**: Sometimes a migration will require a table to be dropped, removing all existing database triggers and functions. These will have to be manually re-added via [Supabase Trigger Dashboard](https://supabase.com/dashboard/project/hgfayzrlsaamaipszaeu/database/triggers) and [Supabase Function Dashboard](https://supabase.com/dashboard/project/hgfayzrlsaamaipszaeu/database/functions).

#### Recovery Steps

If you encounter the missing grants issue, follow these steps:

1. Create a draft migration:

```bash
prisma migrate dev --create-only
```

2. Add the following SQL to supabe SQL editor [Supabase SQL Editor](https://supabase.com/dashboard/project/hgfayzrlsaamaipszaeu/sql/new):

```sql
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema auth to postgres, service_role;
grant all privileges on all functions in schema auth to postgres, service_role;
grant all privileges on all sequences in schema auth to postgres, service_role;

alter default privileges in schema auth grant all on tables to postgres, service_role;
alter default privileges in schema auth grant all on functions to postgres, service_role;
alter default privileges in schema auth grant all on sequences to postgres, service_role;
```

3. Apply the draft migration:

```bash
prisma migrate dev
```

4. Re-add the triggers to update the update_at fields on document and document_versions using [Supabase SQL Editor](https://supabase.com/dashboard/project/hgfayzrlsaamaipszaeu/sql/new):

```sql
-- Enable MODDATETIME extension
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- Trigger to update `updated_at` in documents
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Trigger to update `updated_at` in document_versions
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON document_versions
FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Function to update documents.updated_at when document_versions is updated
CREATE OR REPLACE FUNCTION update_document_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE documents SET updated_at = NOW() WHERE id = NEW.document_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call update_document_timestamp when document_versions is updated
CREATE TRIGGER handle_document_version_updated
AFTER UPDATE ON document_versions
FOR EACH ROW EXECUTE FUNCTION update_document_timestamp();
```

5. [UNTESTED] Re-add the triggers to create profile documents and profile projects when a document or a profile is created using the [Supabase SQL Editor](https://supabase.com/dashboard/project/hgfayzrlsaamaipszaeu/sql/new):

```sql
-- Row Level Security for profiles
ALTER TABLE profiles
  ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile." ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Trigger Function for New User Created
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

-- Trigger for New User Created
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger Function for Project Created
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_projects (project_id, profile_id)
  VALUES (
    NEW.id,
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Project Created
CREATE TRIGGER on_project_created
AFTER INSERT ON public.projects
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_project();

-- Trigger Function for Document Created
CREATE OR REPLACE FUNCTION public.handle_new_document()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_documents (document_id, profile_id)
  VALUES (
    NEW.id,
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Document Created
CREATE TRIGGER on_document_created
AFTER INSERT ON public.documents
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_document();

```

---

## Functions

### Trigger Functions

### TODO - MOVE THESE INTO THE SQL EDITOR QUERY INSTEAD OF ADDING ONE BY ONE

Done here [Supabase Function Dashboard](https://supabase.com/dashboard/project/hgfayzrlsaamaipszaeu/database/functions)
Then triggered from here [Supabase Trigger Dashboard](https://supabase.com/dashboard/project/hgfayzrlsaamaipszaeu/database/triggers)

1. **on_auth_user_created**

```sql
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
```

2. **on_project_created**

```sql
BEGIN
INSERT INTO public.profile_projects (project_id, profile_id, scope_access)
VALUES (
  NEW.id,
  auth.uid(),
  'admin'
);
RETURN NEW;
END;
```

3. **on_document_created**

```sql
BEGIN
INSERT INTO public.profile_documents (document_id, profile_id, scope_access)
VALUES (
  NEW.id,
  auth.uid(),
  'admin'
);
RETURN NEW;
END;
```

4. **on_profile_created**

```sql
BEGIN
INSERT INTO public.profile_organizations (profile_id, scope_access)
VALUES (
  auth.uid(),
  'write'
);
RETURN NEW;
END;
```

---
