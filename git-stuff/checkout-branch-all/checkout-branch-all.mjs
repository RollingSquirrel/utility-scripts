
import fs from 'fs/promises';
import { exec } from 'child_process';

/**
 * Checks out the given branch in all git repositories in the current directory.
 * If no branch is given, the default branch develop is checked out.
 */
export async function main() {
  const targetBranch = process.argv[2] || 'develop';

  const allFilesOfDir = await fs.readdir(process.cwd());

  for (const file of allFilesOfDir) {
    const fileStat = await fs.stat(file);
    if (fileStat.isDirectory()) {
      const repositoryDir = await fs.readdir(file);

      if (repositoryDir.includes('.git')) {
        try {
          await new Promise((resolve, reject) => {
            exec(`git checkout ${targetBranch}`, { cwd: file }, (error, stdout, stderr) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(true);
            });
          });

          console.log(`\x1b[32m${file} checked out branch ${targetBranch}\x1b[0m`);
        } catch (error) {
          console.log(`\x1b[31m${file} The branch does probably not exist. Skipping...\x1b[0m`);
        }
      } else {
        console.log(`\x1b[31m${file} is not a git repo. Skipping...\x1b[0m`);
      }
    } else {
      console.log(`\x1b[31m${file} is not a directory. Skipping...\x1b[0m`);
    }
  }
}

main();