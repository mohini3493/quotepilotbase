import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
    };

    // attach admin info if needed later
    (req as any).admin = decoded;

    next(); // 🔥 THIS WAS MISSING / BROKEN BEFORE
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
}
