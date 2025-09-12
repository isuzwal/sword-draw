import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SCERT } from "@repo/backend-common/config";
import { SignupScheam, LoginScheam, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/clinet";
import { hash } from "bcrypt-ts";
export const Singup = async (req: Request, res: Response) => {
  const parsed = SignupScheam.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: false,
      message: " Incorrect input",
    });
  }
  try {
    const { username, email, password } = parsed.data;

    // check in db it alredy presnt .
    const IsExistinguser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (IsExistinguser) {
      return res.status(409).json({
        status: false,
        message: "User already exists with this email",
      });
    }

    // hasing the password
    const hashpassword = await hash(password, 10);
    const useraccount = await  prismaClient.user.create({
      data: {
        name:username,
        email,
        password: hashpassword,
      },
    });
    // 
    res.status(200).json({
        status:true,
        message:"Account create successfully",
        data:useraccount
    })
  } catch (error) {
    console.log("Erorr -->", error);
    res.status(500).json({
      status: false,
      message: " Incorrect input",
    });
  }
};
// Login
export const Login = async (req: Request, res: Response) => {
  const parsed= LoginScheam.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: false,
      message: " Incorrect input",
    });
  }
  try {
    const {email,password} = parsed.data;
    // check in db it alredy presnt .
   const IsExistinguser = await prismaClient.user.findUnique({
      where: { email },
    });
    if(!IsExistinguser)
      return res.status(404).json({
    status: false,
    message: "User not found",
   })
   if(!IsExistinguser){
    return res.status(404).json({
      status:false,
      message:"User not exits !"
    })
   }

    const token = jwt.sign(
      {
      userId:IsExistinguser.id,
      },
      JWT_SCERT
    );
    return res.status(200).json({
      status: true,
      token: token,
    });
  } catch (error) {
    console.log(" Erorr -->", error);
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
  }
};
// middleware
export const RoomSpace = async (req: Request, res: Response) => {
  const prased = CreateRoomSchema.safeParse(req.body);
  try {
    if (!prased.success) {
      return res.status(400).json({
        message: "Incorrect Input",
        status: false,
      });
    }
    // @ts-ignore
    const userId=req.userId
    const room= await prismaClient.room.create({
      data:{
        slug:prased.data.name,
        adminId:userId
      }
    })
    return res.status(200).json({
       status:true,
       message:"Room created successfully ",
       room:room.id
    })
  } catch (error) {
    console.log(" Erorr -->", error);
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
  }
};
// get the chat form db 
export const RoomChat=async(req:Request,res:Response)=>{
    try{
      
      // chefk in the db of the chat
      const chata= await prismaClient.chat.findMany();
        return res.status(200).json({
          status:true,
        data:{
          chata
        }
        })
 }catch(error){
 console.log(" Erorr -->", error);
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
 }

}