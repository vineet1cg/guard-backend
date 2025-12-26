import { OAuth2Client } from "google-auth-library";

/**
 * Google OAuth Token Verification Utility
 * Safe, lazy-loaded, production-ready
 * No environment access at import time
 */

let oauthClient = null;

/**
 * Lazily initialize OAuth client
 * Prevents startup crashes before dotenv loads
 */
const getOAuthClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  if (!oauthClient) {
    oauthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
    });
  }

  return oauthClient;
};

/**
 * Verify Google ID Token
 */
const verifyGoogleToken = async (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid Google token");
  }

  const client = getOAuthClient();

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch {
    throw new Error("Google token verification failed");
  }

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid token payload");
  }

  if (
    payload.iss !== "https://accounts.google.com" &&
    payload.iss !== "accounts.google.com"
  ) {
    throw new Error("Invalid token issuer");
  }

  if (!payload.sub || !payload.email) {
    throw new Error("Required Google account data missing");
  }

  if (!payload.email_verified) {
    throw new Error("Google email not verified");
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || "User",
    avatar: payload.picture || "",
    emailVerified: true,
  };
};

export default verifyGoogleToken;
