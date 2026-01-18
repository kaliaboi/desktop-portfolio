import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    clientRouterFilter: false,
  },
  // Disable static generation for client-only app
  generateBuildId: async () => {
    return 'build'
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, if any
})

export default withMDX(nextConfig)
