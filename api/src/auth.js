import { createRemoteJWKSet, jwtVerify } from 'jose';

// Admin writes need an access token from auth.kevinprk.com
// (GET /api/token?aud=karaoke; client "karaoke" admits the admins group only).
const AUTH_ISSUER = (process.env.AUTH_ISSUER || 'https://auth.kevinprk.com').replace(/\/$/, '');
const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE || 'karaoke';
const JWKS = createRemoteJWKSet(new URL(`${AUTH_ISSUER}/keys`), { cacheMaxAge: 60 * 60_000 });

export async function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { payload } = await jwtVerify(header.slice(7), JWKS, {
      issuer: AUTH_ISSUER,
      audience: AUTH_AUDIENCE,
      algorithms: ['RS256'],
      clockTolerance: 30,
    });
    if (!payload.groups?.includes('admins')) throw new Error('not an admin');
    req.user = { username: payload.preferred_username };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
