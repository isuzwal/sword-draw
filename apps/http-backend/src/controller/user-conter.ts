
import { Router } from "express"
import { middlware } from "../middleware";
import { Singup,Login,RoomSpace } from "../router/router";
const router: ReturnType<typeof Router> = Router();
router.post("/signup",Singup);
router.post("/login",Login);
router.post("/create-room",middlware,RoomSpace);

export default  router;