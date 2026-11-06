import { UserProfile, UserRole, AdminPermission } from './roles';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number; // seconds, 3600 (1 hour)
  issuedAt: number;  // timestamp ms
  expiresAt: number; // timestamp ms
}

export interface JwtPayload {
  sub: string;       // user ID (e.g. GVS-2027-0001, TCH0001)
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  permissions?: AdminPermission[];
  iat: number;       // issued at in seconds
  exp: number;       // expires at in seconds
  iss: 'futureschool-auth-service';
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  maskedEmail?: string;
  demoOtp?: string;
  user?: UserProfile;
}

/**
 * Creates a standard simulated base64url JWT token structure for Spring Boot alignment
 * Format: header.payload.signature
 */
export function createSimulatedJwt(user: UserProfile, expiresInSec: number = 3600): AuthToken {
  const nowMs = Date.now();
  const iat = Math.floor(nowMs / 1000);
  const exp = iat + expiresInSec;

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload: JwtPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    permissions: user.permissions,
    iat,
    exp,
    iss: 'futureschool-auth-service'
  };

  const toBase64 = (obj: object) => {
    return btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const encodedHeader = toBase64(header);
  const encodedPayload = toBase64(payload);
  const mockSignature = btoa(`${encodedHeader}.${encodedPayload}.secretKeySalt`).slice(0, 32);

  const accessToken = `${encodedHeader}.${encodedPayload}.${mockSignature}`;
  const refreshToken = `rt_${btoa(`${user.id}_${nowMs}`).replace(/=/g, '')}`;

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: expiresInSec,
    issuedAt: nowMs,
    expiresAt: nowMs + expiresInSec * 1000
  };
}

/**
 * Decodes simulated base64url JWT token
 */
export function decodeSimulatedJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}
