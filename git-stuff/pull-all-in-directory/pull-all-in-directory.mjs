import { exec } from 'child_process';
import { readdir, stat } from 'fs/promises';
import path from 'path';

/**
 * Pulls all git repositories in the current directory.
 */
async function main() {
  const allFilesInDir = await readdir('./');

  for (const fileInDir of allFilesInDir) {
    const directoryPath = path.join(process.cwd(), fileInDir);

    if (!(await stat(directoryPath)).isDirectory()) {
      console.log('Skipping', fileInDir)
      continue;
    }

    console.log(`Pulling`, fileInDir);
    exec('git pull', { cwd: directoryPath }, (err, stdout, stderr) => {
      if (err) {
        console.log(stdout, stderr);
        console.log('Pull failed', fileInDir)
        throw new Error("Cannot pull " + fileInDir);
      } else {
        console.log(`\x1b[32mPull successful\x1b[0m`, fileInDir);
      }
    })
  }
}

main();