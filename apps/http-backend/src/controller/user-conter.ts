
import { Router } from "express"
import { middlware } from "../middleware";
import { Singup,Login,RoomSpace ,RoomChat,RoomSlug} from "../router/router";
const router: ReturnType<typeof Router> = Router();
router.post("/signup",Singup);
router.post("/login",Login);
router.post("/create-room",middlware,RoomSpace);
router.get("/chat/:roomId",middlware,RoomChat)
router.get("/room/:slug",middlware,RoomSlug)
export default  router;