/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "hgfayzrlsaamaipszaeu.supabase.co",
      "source.boringavatars.com",
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/login",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/signin",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
