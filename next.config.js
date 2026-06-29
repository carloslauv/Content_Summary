/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['youtube-transcript', '@distube/ytdl-core'],
  },
};
module.exports = nextConfig;
