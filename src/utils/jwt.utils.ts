import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface TokenPayload {
    userId: string;
    roles: string[];
}

export const generateAccessToken = (userId: string, roles: string[]): string => {
    try {
        return jwt.sign({ userId, roles }, JWT_SECRET, { expiresIn: "15m" });
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Access token generation failed");
    }
};

export const generateRefreshToken = (userId: string, roles: string[]): string => {
    try {
        return jwt.sign({ userId, roles }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Refresh token generation failed");
    }
};



export const verifyRefreshToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
        console.error("Invalid refresh token:", error);
        throw new Error("Invalid or expired refresh token");
    }
};
