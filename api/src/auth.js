const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || header !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
