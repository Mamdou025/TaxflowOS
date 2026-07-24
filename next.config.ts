import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";
import path from "path";

const nextConfig: NextConfig = {
  // The CopilotKit runtime endpoint (app/api/copilotkit/route.ts) imports BuiltInAgent
  // from '@copilotkit/runtime/v2', whose barrel pulls in the Express/Hono endpoint
  // adapters. Express does a dynamic `require(mod).__express` (view engine) that the
  // Turbopack bundler can't statically resolve. This route runs in the Node runtime,
  // so mark the runtime (and express) as server-external — they're require()d at
  // runtime instead of bundled, and the dynamic require works fine in Node.
  serverExternalPackages: ['@copilotkit/runtime', 'express'],
  webpack(config) {
    // Redirect all `import ... from 'wouter'` to our Next.js-compatible shim
    config.resolve.alias['wouter'] = path.resolve('./features/worksheets/legacy/wouter-shim.tsx');
    return config;
  },
};

export default withWorkflow(nextConfig);
