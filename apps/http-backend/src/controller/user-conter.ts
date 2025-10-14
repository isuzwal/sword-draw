
import { Router } from "express"
import { middleware } from "../middleware.js";
import { Singup,Login,RoomChat,UserRoom,AccountInfo,RoomSpace } from "../router/router.js";

const router: ReturnType<typeof Router> = Router();
router.post("/signup",Singup);
router.post("/login",Login);
// this for the3 create the room by providing the room-name 
router.post("/create-room",middleware,RoomSpace);
// after the room is make get the roomId thne join
router.get("/chat/:roomId",middleware,RoomChat)
router.get("/rooms",middleware,UserRoom)
router.get("/me",middleware,AccountInfo)
// router.get("/room/:slug",middlware,RoomSlug)

// current user info

export default  router; 