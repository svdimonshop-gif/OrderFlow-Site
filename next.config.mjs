const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "/OrderFlow-Site" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: isProduction ? `${basePath}/` : undefined,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: "https://svdimonshop-gif.github.io/OrderFlow-Site"
  }
};

export default nextConfig;
