import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import  {JWT_SCERT} from "@repo/backend-common/config" 

 // Web-Soocket connection
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", function connection(ws, request) {
  const url = request.url; //  (when the user try to connected  get the url ws://localhost:3000?token=124de )
  if (!url) {
    return;
  }
  // get the the token from the url prams
  // ["WS:://localhsot:3000","token=12345"->split grt first arg
  const queryParms = new URLSearchParams(url.split("?")[1]);
  const token = queryParms.get("token") || " ";
  // decode the token only then connection
  const decode = jwt.verify(token, JWT_SCERT);
  if (!decode || !(decode as JwtPayload).userId) {
    ws.close();
    return;
  }
  ws.on("error", console.error);
  ws.on("message", function message(data) {
    console.log("Data -> ", data);
  });
  ws.send("Hello");
});
