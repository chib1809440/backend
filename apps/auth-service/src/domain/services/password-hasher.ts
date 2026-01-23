export interface PasswordHasher {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}

export const TOKEN_PASSWORD_HASHER = Symbol('TOKEN_PASSWORD_HASHER');
