"use client";

import { useEffect, useState } from "react";

import { WS_URL } from "../config";
import { MainCanvasPage } from "./main-canvas-view";

export default function CanvaPage({ roomId }: { roomId: string }) {
  // connection for the socket
  const [socket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // sending the token as the parms 
    const token=localStorage.getItem("token");
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    ws.onopen = () => {
      setWebSocket(ws);
      ws.send(JSON.stringify({
        type:"join_room",
        roomId
      }))
    };
      ws.onerror = (err) => {
        console.error("WS error:", err)
        return err
      }
     return () => {
    ws.close();
  }; 
  },[roomId]);
  if (!socket) {
    return <div>Connecting to web-scoket....</div>;
  }

  // show this components after the web-scoket it connect then show it
  return <MainCanvasPage roomId={roomId} socket={socket} />;
}
