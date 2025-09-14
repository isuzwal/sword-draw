"use client";

import { useEffect, useState } from "react";

import { WS_URL } from "../config";
import { MainCanvasPage } from "./main-canvas-view";

export default function CanvaPage({ roomId }: { roomId: string }) {
  // connection for the socket
  const [socket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // estabiled the socket connection form the  fornt-end to web-socket backend
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      setWebSocket(ws);
      ws.send(JSON.stringify({
        type:"join_room",
        roomId
      }))
    };
  });
  if (!socket) {
    return <div>Connecting to web-scoket....</div>;
  }

  // show this components after the web-scoket it connect then show it
  return <MainCanvasPage roomId={roomId} socket={socket} />;
}
