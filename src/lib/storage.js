import { supabaseClient } from "./supabase";

export async function uploadImage(file, bucket = "ijin", destinationPath = "") {
  let myuuid = crypto.randomUUID();
  const path = `${destinationPath}${myuuid}`;
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    console.log(error);
  }

  const { data, error: urlError } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(path);

  if (urlError) {
    throw urlError;
  }

  return data;
}
