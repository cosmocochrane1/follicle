import { API_BASE_URL } from ".";


/**
 * Fetch Liveblocks API
 *
 * Similar to using normal fetch with the Liveblocks API, with more error checking
 * Add `API_BASE_URL` to `urlEnd`, and `Authorization` header with `SECRET_API_KEY`
 * Uses Liveblocks API
 *
 * @param urlEnd - The part of the URL to attach to the host
 * @param fetchOptions - Fetch options to be used
 */
export async function fetchLiveblocksApiEndpoint(
  urlEnd,
  fetchOptions
) {
  const SECRET_API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!SECRET_API_KEY) {
    return {
      error: {
        code: 403,
        message: "No API key supplied",
        suggestion:
          "Try adding your LIVEBLOCKS_SECRET_KEY to your .env.local file",
      },
    };
  }

  const url = `${API_BASE_URL}${urlEnd}`;

  try {
    const response = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${SECRET_API_KEY}`,
      }),
      ...fetchOptions,
    });

    let body;
    try {
      body = await response.json();
    } catch {
      body = {};
    }

    if (!response.ok) {
      if (body.error?.code && body.error?.message && body.error?.suggestion) {
        console.error(body.error);
        return { error: body.error };
      }

      const customError = customLiveblocksErrors[body.error];
      if (customError) {
        console.error(customError);
        return { error: customError };
      }

      const error = {
        code: 500,
        message: `Error when calling ${url}: ${
          body?.error ?? response.statusText
        }`,
        suggestion: "Please try again",
      };
      console.log(error);
      return { error };
    }

    return { data: body };
  } catch (err) {
    if (err?.code && err?.message && err?.suggestion) {
      console.error(err);
      return { error: err };
    }

    const customError = customLiveblocksErrors[err];
    if (customError) {
      console.error(customError);
      return { error: customError };
    }

    const error = {
      code: 500,
      message: `Error when calling ${url}`,
      suggestion: "Please try again",
    };
    console.error(error);
    console.error(err);
    return { error };
  }
}

const customLiveblocksErrors = {
  ROOM_NOT_FOUND: {
    code: 404,
    message: "Document not found",
    suggestion: "Please check the URL is correct or the document exists",
  },
};
