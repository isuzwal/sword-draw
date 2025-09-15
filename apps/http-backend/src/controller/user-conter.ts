
import { Router } from "express"
import { middlware } from "../middleware";
import { Singup,Login,RoomSpace ,RoomChat,RoomSlug} from "../router/router";
const router: ReturnType<typeof Router> = Router();
router.post("/signup",Singup);
router.post("/login",Login);
// this for the3 create the room by providing the room-name 
router.post("/create-room",middlware,RoomSpace);
// after the room is make get the roomId thne join
router.get("/chat/:roomId",middlware,RoomChat)
router.get("/room/:slug",middlware,RoomSlug)
export default  router; 