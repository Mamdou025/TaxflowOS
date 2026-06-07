import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    // Redirect all `import ... from 'wouter'` to our Next.js-compatible shim
    config.resolve.alias['wouter'] = path.resolve('./tax-ui/wouter-shim.tsx');
    return config;
  },
};

export default withWorkflow(nextConfig);
