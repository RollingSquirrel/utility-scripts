
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Get the version of a package.json file.
 */
function main() {
  const pathArgument = process.argv[2] || 'package.json';

  const pathToPackageJson = join(process.cwd(), pathArgument);
  const packageJson = JSON.parse(readFileSync(pathToPackageJson, 'utf8'));

  // do not add a newline
  process.stdout.write(packageJson.version);
}

main();