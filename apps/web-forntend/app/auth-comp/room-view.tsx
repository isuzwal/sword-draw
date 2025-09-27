"use client";

import { useEffect, useState } from "react";

import { WS_URL } from "../config";
import { MainCanvasPage } from "./main-canvas-view";
import { Loadingroom } from "@/components/custom-ui/loading";

export default function CanvaPage({ roomId }: { roomId: string }) {
  // connection for the socket
  const [socket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // sending the token as the parms 
    // sending  the  join_room tytpe when use hit the Link button 
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
        console.log("WS error:", err)
        return err
      }
     return () => {
    ws.close();
  }; 
  },[roomId]);
  if (!socket) {
    return <Loadingroom />;
  }

  // show this components after the web-scoket it connect then show it
  return <MainCanvasPage roomId={roomId} socket={socket} />;
}
