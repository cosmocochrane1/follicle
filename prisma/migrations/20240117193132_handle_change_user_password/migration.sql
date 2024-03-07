-- Change user password by checking the current password validity
CREATE OR REPLACE FUNCTION change_user_password(current_plain_password VARCHAR, new_plain_password VARCHAR)
RETURNS JSON
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
_uid uuid; -- for checking by 'is not found'
user_id uuid; -- to store the user id from the request
BEGIN
  -- First of all check the new password rules
  -- not empty
  IF (new_plain_password = '') IS NOT FALSE THEN
    RAISE EXCEPTION 'invalid_new_password';
  -- minimum 8 chars
  ELSIF char_length(new_plain_password) < 8 THEN
    RAISE EXCEPTION 'minimum_8_chars_new_password';
  END IF;
  
  -- Get user by his current auth.uid and current password
  user_id := auth.uid();
  SELECT id INTO _uid
  FROM auth.users
  WHERE id = user_id
  AND encrypted_password =
  crypt(current_plain_password::text, auth.users.encrypted_password);

  -- Check the currect password
  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid_current_password';
  END IF;

  -- Then set the new password
  UPDATE auth.users SET 
  encrypted_password =
  crypt(new_plain_password, gen_salt('bf'))
  WHERE id = user_id;
  
  RETURN '{"data":true}';
END;
$$
