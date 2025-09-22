"use client";
import { useEffect, useRef } from "react";
import { DrawInit } from "../draw";
import { Square, Circle, Minus, Type, Eclipse, Spline, Camera } from "lucide-react";
import React, { useState } from "react";
import { CircleHalf } from "phosphor-react";
export function MainCanvasPage({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeShape, setActiveShape] = useState<
    "rectangle" | "circle" | "line" | "ellipse" | "curve" | "half-circle"
  >("rectangle");
  const width = window.innerWidth;
  const height = window.innerHeight;

  const activeShapeRef = useRef(activeShape);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    activeShapeRef.current = activeShape;
  }, [activeShape]);

  useEffect(() => {
    if (canvasRef.current && !isInitializedRef.current) {
      DrawInit(canvasRef.current, roomId, socket, activeShapeRef);
      isInitializedRef.current = true;
    }

    return () => {
      isInitializedRef.current = false;
    };
  }, [canvasRef, roomId, socket]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height} className="bg-black cursor-crosshair" />

      <div className="absolute top-2 w-full flex items-center justify-center px-2">
        <div className="absolute w-56 border-2 flex gap-3 right-[38rem] left-[38rem] sm:right-1/2 sm:left-1/2 top-2 p-1 bg-zinc-800 border-zinc-900 text-white rounded-md">
          <button
            onClick={() => {
              setActiveShape("rectangle");
            }}
            className={`w-7 h-7 flex cursor-pointer justify-center items-center rounded-md ${
              activeShape === "rectangle" ? "bg-zinc-600" : "bg-neutral-700"
            }`}>
            <Square size={18} />
          </button>

          <button
            onClick={() => {
              setActiveShape("circle");
            }}
            className={`w-7 h-7 flex cursor-pointer justify-center items-center rounded-md ${
              activeShape === "circle" ? "bg-zinc-600" : "bg-neutral-700"
            }`}>
            <Circle size={18} />
          </button>

          <button
            onClick={() => {
              console.log("Setting active shape to line");
              setActiveShape("line");
            }}
            className={`w-7 h-7 cursor-pointer flex justify-center items-center rounded-md ${
              activeShape === "line" ? "bg-zinc-600" : "bg-neutral-700"
            }`}>
            <Minus size={18} />
          </button>
          <button
            onClick={() => {
              setActiveShape("ellipse");
            }}
            className={`w-7 h-7 cursor-pointer flex justify-center items-center rounded-md ${
              activeShape === "ellipse" ? "bg-zinc-600" : "bg-neutral-700"
            }`}>
            <Eclipse size={18} />
          </button>
          <button
            onClick={() => {
              setActiveShape("curve");
            }}
            className={`w-7 h-7 cursor-pointer flex justify-center items-center rounded-md ${
              activeShape === "curve" ? "bg-zinc-600" : "bg-neutral-700"
            }`}>
            <Spline size={18} />
          </button>
         
          <button
            onClick={() => {
              setActiveShape("half-circle");
            }}
            className={`w-7 h-7 cursor-pointer flex justify-center items-center rounded-md ${
              activeShape === "half-circle" ? "bg-zinc-600" : "bg-neutral-700"
            }`}>
            <CircleHalf size={18}   strokeWidth={3}/>
          </button>
         
        </div>
      </div>
    </div>
  );
}
