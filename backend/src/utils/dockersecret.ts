import fs from 'fs';

export function getDockerSecret(secret_name: string): string {
  try {
    return fs.readFileSync(`/run/secrets/${secret_name}`, 'utf8').trim();
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.error(`An error occurred while trying to read the secret: ${secret_name}. Err: ${err}`);
    } else {
      console.log(`Could not find the secret, probably not running in swarm mode: ${secret_name}. Err: ${err}`);
    }
    return '';
  }
}
