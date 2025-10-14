import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_Key: process.env.API_Key,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
};

export default nextConfig;
