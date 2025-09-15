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
      Draw-canvas
      <canvas ref={canvasRef} width={1000} height={1000} className="bg-black" ></canvas>
    </div>
  );
}
