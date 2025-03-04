import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";

// Extend Express Request to include `user`
export interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader;
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    jwt.verify(token, JWT_SECRET as string, (err, user) => {
    if (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user as { id: string };
    next();
    });
};
