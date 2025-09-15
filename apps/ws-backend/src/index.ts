import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SCERT } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/clinet";


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

  
  if( !JWT_SCERT){
     return  null ;
 }
  try{
    const decode = jwt.verify(token, JWT_SCERT);
    if (typeof decode == "string") {
      return null;
    }
    if (!decode || !decode.userId) {
      return null;
    }
    return decode.userId;
  }catch(e){
      return null ;
  }
}

wss.on("connection",  function connection(ws, request) {
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
    ws.close();
    return ;
  }
  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("error", console.error);
  ws.on("message", async function message(data) {
    const parsedData=JSON.parse(data as unknown as string) //  parser to JSON
    if(parsedData.type==="join_room"){
      const user=users.find((u)=>u.ws===ws)
      user?.rooms.push(parsedData.roomId)
    }
    // close room
     if(parsedData.type==="leave_room"){
      const user=users.find((u)=>u.ws===ws)
       if (user) {
      user.rooms = user.rooms.filter(room => room !== parsedData.roomId);
    }
    }
    if(parsedData.type==="chat"){
      const roomId=(parsedData.roomId)
      const message=parsedData.message
     if(!roomId){
      console.log("Room ID is miessing here ",roomId)
       ws.close();
     }
      // store the chat before sending to wss but not  it better 
      await prismaClient.chat.create({
        data:{
          roomId:Number(roomId),
          message,
          userId

        }
       })
     
       // for the all each user
      users.forEach(user=>{
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type:"chat",
            message:message,
            roomId
          }))
        }
      })
    }
  });
  ws.send("Hello");
});
