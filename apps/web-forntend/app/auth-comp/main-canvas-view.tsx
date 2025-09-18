"use client ";
import { useEffect, useRef } from "react";
import { DrawInit } from "../draw";
import { Square, Circle, Minus, Type } from "lucide-react";
import React, { useState } from "react";
export function MainCanvasPage({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle" | "line" | "text">("rectangle");
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    if (canvasRef.current) {
      DrawInit(canvasRef.current, roomId, socket,activeShape);
    }
  }, [canvasRef, roomId, socket, activeShape]);

  
  return (
    <div className="relative ">
      <canvas ref={canvasRef} width={width} height={height} className="bg-black "></canvas>
     
      <div className="absolute  top-2 w-full  flex   items-center justify-center  px-2 ">
       <div className="  absolute  w-40 boder-2 flex gap-3  right-[38rem] left-[38rem]   sm:right-1/2 sm:left-1/2 top-2 p-1  bg-zinc-800  border-zinc-900  text-white rounded-md">
           <button
            onClick={() => setActiveShape("rectangle")}
            className={`w-7 h-7 flex  cursor-pointer justify-center items-center rounded-md ${activeShape === "rectangle" ? "bg-zinc-600" : "bg-neutral-700"}`}
          >
            <Square size={18} />
          </button>
          <button
            onClick={() => setActiveShape("circle")}
            className={`w-7 h-7 flex  cursor-pointer  justify-center items-center rounded-md ${activeShape === "circle" ? "bg-zinc-600" : "bg-neutral-700"}`}
          >
            <Circle size={18} />
          </button>
          <button
            onClick={() => setActiveShape("line")}
            className={`w-7 h-7   cursor-pointer flex justify-center items-center rounded-md ${activeShape === "line" ? "bg-zinc-600" : "bg-neutral-700"}`}
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setActiveShape("text")}
            className={`w-7 h-7   cursor-pointer flex justify-center items-center rounded-md ${activeShape === "text" ? "bg-zinc-600" : "bg-neutral-700"}`}
          >
            <Type size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
