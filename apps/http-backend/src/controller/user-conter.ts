
import { Router } from "express"
import { middlware } from "../middleware";
import { Singup,Login,RoomSpace ,RoomChat,RoomSlug, UserRoom} from "../router/router";
import { prismaClient } from "@repo/db/clinet";
const router: ReturnType<typeof Router> = Router();
router.post("/signup",Singup);
router.post("/login",Login);
// this for the3 create the room by providing the room-name 
router.post("/create-room",middlware,RoomSpace);
// after the room is make get the roomId thne join
router.get("/chat/:roomId",middlware,RoomChat)
router.get("/rooms",middlware,UserRoom)
// router.get("/room/:slug",middlware,RoomSlug)

// current user info
router.get("/me", middlware, async (req, res) => {
    try{
        // @ts-ignore
        const userId = req.userId as string | undefined;
        if(!userId){
            return res.status(401).json({ status:false, message:"Unauthorized"});
        }
        const user = await prismaClient.user.findUnique({
            where:{ id: userId },
            select:{ id:true, name:true, email:true }
        })
        if(!user){
            return res.status(404).json({ status:false, message:"User not found"});
        }
        return res.status(200).json({ status:true, data:user });
    }catch(err){
        return res.status(500).json({ status:false, message:"Internal server error"});
    }
})
export default  router; 