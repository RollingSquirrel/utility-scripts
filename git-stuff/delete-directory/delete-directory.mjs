import { rm, stat } from "fs/promises";
import { join } from "path";

/**
 * Delete given directory in current working directory.
 * 
 * If no argument is given, the directory "dist" will be deleted.
 */
async function main() {
  const target = process.argv[2] || 'dist';
  const pathToDirectory = join(process.cwd(), target);

  try {
    const directoryStat = await stat(pathToDirectory);

    if (!directoryStat.isDirectory()) {
      console.log(`\x1b[31mGiven path is not a directory: ${pathToDirectory}\x1b[0m`);
      return;
    }
  } catch (error) {
    console.log(`Path ${pathToDirectory} does not exist. Skipping delete...`);
    return;
  }

  console.log(`Deleting directory: ${pathToDirectory}`);
  await rm(pathToDirectory, { force: true, recursive: true, });
}

main();