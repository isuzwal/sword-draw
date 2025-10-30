import { Request, Response, NextFunction } from "express";
import jwt, {  JwtPayload } from "jsonwebtoken";
import { JWT_SECERT } from "@repo/backend-common/config";
 

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  
   if (!token) {
    return res.status(403).json({ message: "Unauthorized: No token provided" });
   }
  try {
      const decoded = jwt.verify(token, JWT_SECERT ) as JwtPayload ;
      if (typeof decoded === "string") {
        return res.status(403).json({message:"Invalid token !"})
      }
      if(!( "userId" in decoded)){
        return  res.status(403).json({ message: "Invalid token structure" });
      }
      if (typeof decoded.userId !== "string") {
        return res.status(403).json({ message: "Invalid userId type" });
        }
        req.userId=decoded.userId
        next();
      

  } catch (err) {
    return res.status(403).json({ message: "Unauthorized" });
  }
}
