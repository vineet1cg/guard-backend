import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const verifyGoogleToken = async (googleToken) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.sub) {
    throw new Error('Invalid Google token payload');
  }

  return payload;
};
