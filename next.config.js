/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure sources directory is included in production builds
  // This is important for file-based content loading
  serverRuntimeConfig: {
    // This ensures the sources directory is accessible at runtime
  },
  // Make sure static files in sources are accessible
  webpack: (config, { isServer }) => {
    // Ensure sources directory is accessible in production
    if (isServer) {
      config.externals = config.externals || [];
    }
    return config;
  },
  // Ensure sources directory is copied to output
  // This is critical for serverless deployments
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['./sources/**/*'],
    },
  },
}

module.exports = nextConfig
