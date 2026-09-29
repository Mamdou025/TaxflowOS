import { captureDesktop } from './capture.mjs';

// Local diagnostic only: discard the pixels without printing, saving or uploading them.
try {
  const frame = await captureDesktop();
  console.log(
    `Desktop capture works: ${frame.width} × ${frame.height}. No image was saved or uploaded.`,
  );
} catch {
  console.error(
    'Desktop capture failed. Keep Windows unlocked and run this from the same interactive desktop as Goose. Confirm capture.mjs and capture-windows.ps1 are installed together.',
  );
  process.exitCode = 1;
}
