import { OAuth2Client } from "google-auth-library";

/**
 * Google OAuth Token Verification Utility
 * Hardened, production-safe
 */

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not configured");
}

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
});

const verifyGoogleToken = async (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload?.email) {
      throw new Error("Invalid token payload");
    }

    if (
      payload.iss !== "https://accounts.google.com" &&
      payload.iss !== "accounts.google.com"
    ) {
      throw new Error("Invalid token issuer");
    }

    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Invalid token audience");
    }

    if (!payload.email_verified) {
      throw new Error("Email not verified");
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name || "User",
      avatar: payload.picture || "",
      emailVerified: true,
    };
  } catch {
    throw new Error("Google authentication failed");
  }
};

export default verifyGoogleToken;
