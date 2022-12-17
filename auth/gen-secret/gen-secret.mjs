
import crypto from 'crypto';

/**
 * Generates a random secret key for e.g. JWT authentication.
 * Output it with > file.txt to copy
 */
function main() {
  console.log(crypto.randomBytes(256).toString('base64'));
}

main();