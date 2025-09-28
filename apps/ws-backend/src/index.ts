import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SCERT } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/clinet";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

// Global user array
const users: User[] = [];
// WebSocket server
const wss = new WebSocketServer({ port: 8080 });
function usercheck(token: string): string | null {
  if (!JWT_SCERT) {
    return null;
  }
  
  try {
    const decode = jwt.verify(token, JWT_SCERT);
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
     
      
    if (parsedData.type === "join_room") {
  const user = users.find((u) => u.ws === ws);
  if (user && !user.rooms.includes(parsedData.roomId)) {
    user.rooms.push(parsedData.roomId);

  }

  // Fetch all existing shapes for this room from DB
  try {
    const existingShapes = await prismaClient.chat.findMany({
      where: { roomId: Number(parsedData.roomId) },
      orderBy: { id: "asc" }, // oldest first
    });

 
    ws.send(JSON.stringify({
      type: "room_history",
      roomId: parsedData.roomId,
      content: existingShapes.map(shape => shape.content)
    }));
    
  } catch (err) {
    console.error("Error fetching room history:", err);
  }
}
      else if (parsedData.type === "leave_room") {
        const user = users.find((u) => u.ws === ws);
        if (user) {
          user.rooms = user.rooms.filter(room => room !== parsedData.roomId);
        
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
          user.rooms.includes(roomId) && user.ws !== ws
        );

        usersInRoom.forEach(user => {
          if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({
              type: "chat",
              content,
              roomId,
              userId 
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