import { Request,Response } from "express";
import  jwt from  "jsonwebtoken";
import { JWT_SCERT } from "@repo/backend-common/config";
import {SignupScheam,LoginScheam,CreateRoomSchema} from "@repo/common/types"

export const Singup=async(req:Request,res:Response)=>{
    const data=SignupScheam.safeParse(req.body);
    try{
        if(!data.success){
            return res.status(400).json({
                status:false,
                message:" Incorrect input"
            })
        }
        // check in db it alredy presnt .
    }catch(error){
        console.log("Erorr -->",error)
        res.status(500).json({
            status:false,
             message:" Incorrect input"
        })
    }
}
// Login
export const Login=async(req:Request,res:Response)=>{
    const data=LoginScheam.safeParse(req.body);
    try{
        if(!data.success){
            return res.status(400).json({
                status:false,
                message:" Incorrect input"
            })
        }
        // check in db it alredy presnt .
        const userId=1;
        const token= jwt.sign({
            userId
        },JWT_SCERT)
        return res.status(200).json({
            status:true,
            token:token
        })
    }catch(error){
        console.log(" Erorr -->",error)
        return res.status(500).json({
            status:false,
            message:" Internal server problem !"
        })
    }
}
 // middleware 
export const RoomSpace=async(req:Request,res:Response)=>{
  const data=CreateRoomSchema.safeParse(req.body);
  try{
   if(!data.success){
    return res.status(400).json({
        message:"Incorrect Input",
        status:false,
    })
   }
  }catch(error){
     console.log(" Erorr -->",error)
        return res.status(500).json({
            status:false,
            message:" Internal server problem !"
        })
  }
}