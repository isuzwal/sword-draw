import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECERT } from "@repo/backend-common/config";
import  { prismaClient } from "@repo/db/client";

interface User {
  ws: WebSocket;
  rooms: number[];
  userId: string;
}

// Global user array
const users: User[] = [];
// WebSocket server
const wss = new WebSocketServer({ port: 8080 });
function usercheck(token: string): string | null {
  if (!JWT_SECERT) {
    return null;
  }
  
  try {
    const decode = jwt.verify(token, JWT_SECERT);
    if (typeof decode === "string") {
      return null;
    }
    if (!decode || !decode.userId) {
      return null;
    }
    return decode.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }
  
  const queryParms = new URLSearchParams(url.split("?")[1]);
  const token = queryParms.get("token") || "";
  const userId = usercheck(token);
  
  if (userId === null) {
    ws.close();
    return;
  }

  // Check if user already exists
  const existing = users.find(u => u.userId === userId);
  if (existing) {
    // Update the WebSocket connection for existing user
    existing.ws = ws;
  
  } else {
    users.push({
      userId,
      rooms: [],
      ws,
    });
    
  }

  ws.on("error", console.error);
  
  ws.on("message", async function message(data) {
    try {
      const parsedData = JSON.parse(data.toString());
      const roomIdNum = parsedData.roomId !== undefined ? Number(parsedData.roomId) : undefined;
    if (parsedData.type === "join_room") {
      // collection of the users at one room
      await prismaClient.roomMember.upsert({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: Number(parsedData.roomId)
        }
      },
      update: {},
      create: {
        userId: userId,
        roomId: Number(parsedData.roomId)
      }
    })
  
    const user = users.find((u) => u.ws === ws);
    if (user && roomIdNum !== undefined && !user.rooms.includes(roomIdNum)) {
    user.rooms.push(roomIdNum);
    
  }
  // Fetch all existing shapes for this room from DB
  try {
    const existingShapes = await prismaClient.chat.findMany({
      where: { roomId: Number(parsedData.roomId) ,
      },
      orderBy: { id: "asc" }, // oldest first
    });

    ws.send(JSON.stringify({
      type: "room_history",
      roomId: roomIdNum,
      content: existingShapes.map(shape => shape.content)
    }));
    
  } catch (err) {
    console.error("Error fetching room history:", err);
  }
}
      else if (parsedData.type === "leave_room") {
        const user = users.find((u) => u.ws === ws);
        if (user && roomIdNum !== undefined) {
          user.rooms = user.rooms.filter(room => room !== roomIdNum);
        }
      }     
      else if (parsedData.type === "chat") {
        const { roomId, message } = parsedData;
        const content = message?.content;

        if (!roomId || !content) {
          return;
        }
        // Save to database ONCE
        try {
          await prismaClient.chat.create({
            data: {
              roomId: Number(roomId),
              content,
              userId
            }
          });
         
        } catch (dbError) {
          console.error("Database error:", dbError);
          return;
        }
        const usersInRoom = users.filter(user => 
          user.rooms.includes(Number(roomId)) && user.ws !== ws
        );
        // for BoradCast to everyone 
        usersInRoom.forEach(user => {
          if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({
              type: "chat",
              content,
              roomId,
              userId,
            }));
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Clean up on disconnect
  ws.on("close", () => {
    const userIndex = users.findIndex(u => u.ws === ws);
    if (userIndex !== -1) {
      
      users.splice(userIndex, 1);
    }
  });

  ws.send(JSON.stringify({ type: "connection",  }));
});

console.log("WebSocket server running on port 8080");