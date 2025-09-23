import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

// Access Token (15 minutes)
export const generateAccessToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// Refress Token (7 days)
export const generateRefreshToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Verify Access Token
export const verifyAccessToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

