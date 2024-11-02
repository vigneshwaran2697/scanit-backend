import * as crypto from 'crypto';
export function generatePassword() {
  return crypto.randomBytes(4).toString('hex');
}
