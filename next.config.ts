import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "redbox.su",
        pathname: "/upload/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/main", destination: "/", permanent: true },
      { source: "/main/", destination: "/", permanent: true },
      { source: "/catalog", destination: "/services/", permanent: true },
      { source: "/catalog/", destination: "/services/", permanent: true },
      { source: "/cart", destination: "/", permanent: true },
      { source: "/cart/", destination: "/", permanent: true },
      { source: "/blog", destination: "/news/", permanent: true },
      { source: "/blog/", destination: "/news/", permanent: true },
      { source: "/action", destination: "/news/", permanent: true },
      { source: "/action/", destination: "/news/", permanent: true },
      { source: "/search", destination: "/", permanent: true },
      { source: "/search/", destination: "/", permanent: true },
      { source: "/404.php", destination: "/", permanent: true },
      { source: "/demo", destination: "/", permanent: true },
      { source: "/demo/", destination: "/", permanent: true },
      {
        source: "/upload/politika-ispolzovanija-cookies-redbox.png",
        destination: "/legal/cookies.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
