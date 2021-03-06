import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthenticatedRequest = Request & {
  userId: string;
};

export function verifyToken(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(422).json({ errors: [{ token: "invalid" }] });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    (err, decoded: { id: string }) => {
      if (err || !decoded.id) {
        return res.status(422).json({ errors: [{ token: "invalid" }] });
      }

      const authReq = req as AuthenticatedRequest;
      authReq.userId = decoded.id;
      next();
    }
  );
}
