import { useEffect, useRef } from "react";
import { DrawInit } from "../draw";

export function MainCanvasPage({ roomId ,socket}: { roomId: string,socket:WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      DrawInit(canvasRef.current, roomId,socket);
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={1200} height={1200} className="bg-black" ></canvas>
    </div>
  );
}
