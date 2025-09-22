import { json, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SCERT } from "@repo/backend-common/config";
import { SignupScheam, LoginScheam, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/clinet";
import { hash, compare } from "bcrypt-ts";

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
    const useraccount = await prismaClient.user.create({
      data: {
        name: username,
        email,
        password: hashpassword,
      },
    });
    //
    res.status(200).json({
      status: true,
      message: "Account create successfully",
      data: useraccount,
    });
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
  const parsed = LoginScheam.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: false,
      message: " Incorrect input",
    });
  }
  try {
    const { email, password } = parsed.data;
    // check in db it alredy presnt .
    const is_Existinguser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (!is_Existinguser)
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    // pasword compare
    const is_paswordMatch = await compare(password, is_Existinguser.password);
    if (!is_paswordMatch) {
      return res.status(404).json({
      status: true,
       message:'Paasword incorrect !'
    });
     
    }
    if (!JWT_SCERT) {
      return;
    }
    const token = jwt.sign(
      {
        userId: is_Existinguser.id,
      },
      JWT_SCERT
    );
    return res.status(200).json({
      status: true,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
  }
};
// middleware
// this is for the user to create by the button in fe send
// the  send me the room-name
export const RoomSpace = async (req: Request, res: Response) => {
  const prased = CreateRoomSchema.safeParse(req.body);
  console.log(prased)
  try {
    if (!prased.success) {
      return res.status(400).json({
        message: "Incorrect Input",
        status: false,
      });
    }
    // @ts-ignore
    const userId = req.userId;
    const room = await prismaClient.room.create({
      data: {
        slug: prased.data.name,
        adminId: userId,
      },
    });
    // afrer room create provide the roomId
    return res.status(200).json({
      status: true,
      message: "Room created successfully ",
      room: room.id,
    });
  } catch (error) {
    console.log(" Erorr -->", error);
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
  }
};
// no-idea whatv it do ?
export const RoomSlug = async (req: Request, res: Response) => {
  const slug = req.body.slug;
  console.log(slug);
  try {
    if (!slug) {
      return res.status(400).json({
        status: false,
        message: "missing the Slug !",
      });
    }
    const room = await prismaClient.room.findFirst({
      where: {
        slug,
      },
    });
    return res.status(200).json({
      status: true,
      room,
    });
  } catch (error) {
    console.log(" Erorr -->", error);
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
  }
};
// get the chat form db
export const RoomChat = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    // check in the db of the chat
    const chat = await prismaClient.chat.findMany({
      where: {
        roomId: Number(roomId),
      },
      orderBy: {
        id: "desc",
      },
  
    });
    if (chat.length > 0) {
      return res.status(200).json({
        status: true,
        data: { chat },
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "No-chat yet !",
        data: { chat: [] },
      });
    }
  } catch (error) {
    console.log(" Erorr -->", error);
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
  }
};
// get the user room section form the 
export const UserRoom=async (req: Request, res: Response)=>{
   // @ts-ignore
 const userId=req.userId;
 console.log(userId)
 try{
  if(!userId){
 return res.status(400).json({
        status: false,
        message: "User not login !",
      });
  }
  const rooms=await prismaClient.room.findMany({
    where:{
      adminId:userId
    }
  })
  console.log('Room -->',rooms)
  return res.status(200).json({
    status:true,
   data:rooms,
   message:"Get the  Rooms  Infroma " 
  })
}catch(err){
  console.log(" Erorr -->", err);
    return res.status(500).json({
      status: false,
      message: " Internal server problem !",
    });
  }
}

