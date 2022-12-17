import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Bumps the version of the package.json file.
 * The version is bumped according to the version type.
 * 
 * The version type can be one of the following:
 * - major
 * - minor
 * - patch
 * 
 * The second argument is the path to the package.json file.
 * If no path is provided, the package.json file in the current working directory is used.
 */
function main() {
  const versionType = process.argv[2] || 'minor';
  const pathArgument = process.argv[3] || 'package.json';

  const pathToPackageJson = join(process.cwd(), pathArgument);
  let fileContent;

  try {
    fileContent = readFileSync(pathToPackageJson, 'utf8')
  } catch (error) {
    console.error(`\x1b[31mCould not read package.json file: ${error.message}\x1b[0m`);
    process.exit(1);
  }

  const packageJson = JSON.parse();
  const version = packageJson.version;
  const versionParts = version.split('.');
  const major = parseInt(versionParts[0]);
  const minor = parseInt(versionParts[1]);
  const patch = parseInt(versionParts[2]);

  switch (versionType) {
    case 'major':
      packageJson.version = `${major + 1}.0.0`;
      break;
    case 'minor':
      packageJson.version = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      packageJson.version = `${major}.${minor}.${patch + 1}`;
      break;
    default:
      throw new Error(`Unknown version type: ${versionType}`);
  }

  writeFileSync(pathToPackageJson, JSON.stringify(packageJson, null, 2));
  console.log(`\x1b[32mVersion bumped to ${packageJson.version}\x1b[0m`);
}

main();