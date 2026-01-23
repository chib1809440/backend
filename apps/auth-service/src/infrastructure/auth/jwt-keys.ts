import * as fs from 'fs';
import * as path from 'path';

const keysDir = path.join(process.cwd(), 'apps/auth-service/keys');

export const JWT_PRIVATE_KEY = fs.readFileSync(
  path.join(keysDir, 'jwt-private.pem'),
  'utf8',
);

export const JWT_PUBLIC_KEY = fs.readFileSync(
  path.join(keysDir, 'jwt-public.pem'),
  'utf8',
);
