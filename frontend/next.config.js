/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization
  staticPageGenerationTimeout: 0,
  
  // Disable image optimization caching
  images: {
    unoptimized: true,
  },
  
  // Disable page caching
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 0,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 0,
  },

  // Disable build caching
  experimental: {
    // This will disable the build cache
    turbotrace: {
      logLevel: 'error',
    },
  },
}

module.exports = nextConfig 