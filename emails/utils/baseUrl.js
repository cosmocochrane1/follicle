const envs = {
  development: "http://localhost:3000",
  staging: "https://staging.archade.dev",
  production: "https://archade.dev",
};

export default function baseUrl(suffix = "") {
  const urlFromEnv = envs[process.env.NODE_ENV] || null;
  const url = `${urlFromEnv}${suffix}`;

  return url;
}
