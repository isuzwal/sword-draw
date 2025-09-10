import {Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SCERT } from '@repo/backend-common/config'

// declare module "express-serve-static-core" {
// interface Request {
// userId?: string;
// }
// }
export function middlware(req:Request,res:Response,next:NextFunction){
    const token=req.headers["authorization"] ?? " ";
    const decode=jwt.verify(token,JWT_SCERT) ;
    if(decode){
        // @ts-ignore
        req.userId=decode.userId;
       next()
    }else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}