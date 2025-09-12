
import { Router } from "express"
import { middlware } from "../middleware";
import { Singup,Login,RoomSpace ,RoomChat} from "../router/router";
const router: ReturnType<typeof Router> = Router();
router.post("/signup",Singup);
router.post("/login",Login);
router.post("/create-room",middlware,RoomSpace);
router.get("/chat",middlware,RoomChat)

export default  router;