import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

/** MCP resources carry their own assets; the viewer never loads a second app origin. */
function inlineViewerAssets(): Plugin {
  return {
    name: 'inscope-inline-chatgpt-viewer',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const html = bundle['chatgpt.html'];
      if (!html || html.type !== 'asset') throw new Error('ChatGPT viewer HTML was not built.');
      let source = String(html.source);
      for (const [name, output] of Object.entries(bundle)) {
        if (output.type === 'chunk') {
          const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          source = source.replace(
            new RegExp(`<script\\b[^>]*src=["'](?:\\./|/)?${escaped}["'][^>]*>\\s*</script>`, 'g'),
            () =>
              `<script type="module">${output.code.replace(/<\/script/gi, '<\\/script')}</script>`,
          );
          delete bundle[name];
        } else if (name.endsWith('.css')) {
          const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          source = source.replace(
            new RegExp(`<link\\b[^>]*href=["'](?:\\./|/)?${escaped}["'][^>]*>`, 'g'),
            () => `<style>${String(output.source).replace(/<\/style/gi, '<\\/style')}</style>`,
          );
          delete bundle[name];
        } else if (name !== 'chatgpt.html') {
          throw new Error(`The ChatGPT viewer requires an external asset: ${name}`);
        }
      }
      if (/<script\b[^>]*\bsrc=|<link\b[^>]*\brel=["'](?:stylesheet|modulepreload)/i.test(source))
        throw new Error('The ChatGPT viewer still references an external script or stylesheet.');
      html.source = source;
    },
  };
}

export default defineConfig({
  root: import.meta.dirname,
  base: './',
  publicDir: false,
  plugins: [react(), tailwindcss(), inlineViewerAssets()],
  resolve: {
    alias: [
      {
        find: /^(?:@\/features\/workflow-builder\/ui\/overlays\/|\.\/)configuration-overlay$/,
        replacement: path.resolve(
          import.meta.dirname,
          'src/features/chatgpt-plugin/read-only-inspector.tsx',
        ),
      },
      { find: '@', replacement: path.resolve(import.meta.dirname, 'src') },
    ],
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist-chatgpt'),
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'chatgpt.html'),
      output: { inlineDynamicImports: true },
    },
  },
});
