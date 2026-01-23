export interface TokenService {
  generateAccessToken(user: {
    id: string;
    email: string;
    status: string;
  }): string;
  generateRefreshToken(userId: string): string;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
