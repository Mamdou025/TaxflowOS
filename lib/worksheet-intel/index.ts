// Worksheet-intelligence — one contract, a generic TemplateConfig adapter, and a
// registry the chat's global actions dispatch through. See ./types for the shape.
export * from './types';
export * from './registry';
export { createTemplateIntel, type TemplateIntelState } from './template-adapter';
