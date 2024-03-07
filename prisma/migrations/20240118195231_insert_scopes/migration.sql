-- Set Application Scopes
DELETE FROM "public"."scopes";

INSERT INTO "public"."scopes" ("access", "description")
VALUES 
  ('read', 'user has view only access.'),
  ('write', 'user has edit access.'),
  ('admin', 'user has permission to perform any action (share, delete, write, change access for other users)')
;
