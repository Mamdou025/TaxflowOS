import * as fs from 'fs';
import * as path from 'path';

/** Return the newest file modification time found at or under a path. */
export function newestMtimeMs(inputPath: string): number {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Build input does not exist: ${inputPath}`);
  }

  const inputStat = fs.statSync(inputPath);
  if (inputStat.isFile()) {
    return inputStat.mtimeMs;
  }

  return Math.max(
    inputStat.mtimeMs,
    ...fs.readdirSync(inputPath).map((entry) => newestMtimeMs(path.join(inputPath, entry))),
  );
}

/** Reuse the existing bundle only when explicitly enabled and fully current. */
export function canReuseProductionBundle(
  productionIndex: string,
  buildInputs: string[],
  skipBuildFlag: string | undefined,
): boolean {
  if (skipBuildFlag !== '1' || !fs.existsSync(productionIndex)) {
    return false;
  }

  if (buildInputs.some((inputPath) => !fs.existsSync(inputPath))) {
    return false;
  }

  const newestBuildInput = Math.max(0, ...buildInputs.map(newestMtimeMs));
  return fs.statSync(productionIndex).mtimeMs >= newestBuildInput;
}