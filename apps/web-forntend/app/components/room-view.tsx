"use client";

import { useEffect, useState } from "react";

import { WS_URL } from "../config";
import { MainCanvasPage } from "./main-canvas-view";

export default function CanvaPage({ roomId }: { roomId: string }) {
  // connection for the socket
  const [socket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // estabiled the socket connection form the  fornt-end to web-socket backend
    // have to send the token to estabile the connection with the web-socket 
    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYmYyMjNkYy01NGNjLTRiYmYtYTk4NS04Y2UxZDVlY2YwMGIiLCJpYXQiOjE3NTc4NzYxNTR9.5fRuXY4Rz7lI4E14xKBYOHFThMfoSImyRJ7bPcPdHDs"
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
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
