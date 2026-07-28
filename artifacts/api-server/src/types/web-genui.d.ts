// The GenUI system prompt is a pre-generated .txt bundled into this server as a
// string via esbuild's `text` loader (build.mjs). esbuild resolves the `@` alias
// to ../ai-workflow-builder/src at build time; this decl gives tsc the string type.
declare module "@/features/genui/system-prompt.txt" {
  const content: string;
  export default content;
}
