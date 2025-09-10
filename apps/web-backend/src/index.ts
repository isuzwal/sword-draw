import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SCERT } from "@repo/backend-common/config";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
// gobal user array
const users: User[] = [];
// Web-Soocket connection
const wss = new WebSocketServer({ port: 8080 });

// checking the user have token or not
function usercheck(token: string): string | null {
  const decode = jwt.verify(token, JWT_SCERT);
  if (typeof decode == "string") {
    return null;
  }
  if (!decode || !decode.userId) {
    return null;
  }
  return decode.userId;
}

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
  const userId = usercheck(token);
  if (userId == null) {
    wss.close();
    return null;
  }
  // after user join the wss socket what to do ?
  // pushing the user to gobal user Aarray
  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("error", console.error);
  ws.on("message", function message(data) {
    // join room
    const parsedData=JSON.parse(data as unknown as string) //  parser to JSON
    if(parsedData.type=="join_room"){
      const user=users.find((u)=>u.ws==ws)
      user?.rooms.push(parsedData.roomId)
    }
    // close room
     if(parsedData.type=="leave_room"){
      const user=users.find((u)=>u.ws==ws)
      user?.rooms.filter((x)=>x==parsedData.room)
    }
    console.log("Data -> ", data);
  });
  ws.send("Hello");
});
