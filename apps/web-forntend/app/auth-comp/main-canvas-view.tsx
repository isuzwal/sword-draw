"use client";
import { useEffect, useRef } from "react";
import { DrawInit } from "../draw";
import { Square, Circle, Minus, Type, Eclipse, Spline, Camera } from "lucide-react";
import React, { useState } from "react";
import { CircleHalf } from "phosphor-react";

export function MainCanvasPage({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [activeShape, setActiveShape] = useState<
    "rectangle" | "circle" | "line" | "ellipse" | "curve" | "half-circle"
  >("rectangle");
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isInitializedRef = useRef(false);
  const activeShapeRef = useRef(activeShape);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    activeShapeRef.current = activeShape;
  }, [activeShape]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (canvasRef.current && !isInitializedRef.current) {
      DrawInit(canvasRef.current, roomId, socket, activeShapeRef, zoomRef, setZoom);
      isInitializedRef.current = true;
    }

    return () => {
      isInitializedRef.current = false;
    };
  }, [canvasRef, roomId, socket]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom < 1 ? prevZoom + 0.2 : prevZoom + 0.3;
      return Math.min(5, newZoom);
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom <= 1 ? Math.max(0.1, prevZoom - 0.2) : prevZoom - 0.3;
      return newZoom;
    });
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height} className="bg-black cursor-crosshair" />

      <div className="absolute top-2 w-full flex items-center justify-center px-2">
        <div className="flex gap-3 items-center justify-center bg-zinc-950 opacity-90 border-2 border-zinc-800 shadow-2xl text-white rounded-lg p-2 md:w-auto w-full max-w-[50%] mx-auto">
          {/* Shape Selection Buttons */}
          <button
            onClick={() => setActiveShape("rectangle")}
            className={`w-8 h-8 p-1 flex cursor-pointer justify-center items-center rounded-md transition-colors ${
              activeShape === "rectangle"
                ? "bg-zinc-700 border border-zinc-600"
                : "bg-zinc-900 border border-neutral-800 hover:bg-zinc-800"
            }`}
            title="Rectangle">
            <Square size={18} />
          </button>

          <button
            onClick={() => setActiveShape("circle")}
            className={`w-8 h-8 p-1 flex cursor-pointer justify-center items-center rounded-md transition-colors ${
              activeShape === "circle"
                ? "bg-zinc-700 border border-zinc-600"
                : "bg-zinc-900 border border-neutral-800 hover:bg-zinc-800"
            }`}
            title="Circle">
            <Circle size={18} />
          </button>

          <button
            onClick={() => setActiveShape("line")}
            className={`w-8 h-8 p-1 cursor-pointer flex justify-center items-center rounded-md transition-colors ${
              activeShape === "line"
                ? "bg-zinc-700 border border-zinc-600"
                : "bg-zinc-900 border border-neutral-800 hover:bg-zinc-800"
            }`}
            title="Line">
            <Minus size={18} />
          </button>

          <button
            onClick={() => setActiveShape("ellipse")}
            className={`w-8 h-8 p-1 cursor-pointer flex justify-center items-center rounded-md transition-colors ${
              activeShape === "ellipse"
                ? "bg-zinc-700 border border-zinc-600"
                : "bg-zinc-900 border border-neutral-800 hover:bg-zinc-800"
            }`}
            title="Ellipse">
            <Eclipse size={18} />
          </button>

          <button
            onClick={() => setActiveShape("curve")}
            className={`w-8 h-8 p-1 cursor-pointer flex justify-center items-center rounded-md transition-colors ${
              activeShape === "curve"
                ? "bg-zinc-700 border border-zinc-600"
                : "bg-zinc-900 border border-neutral-800 hover:bg-zinc-800"
            }`}
            title="Curve">
            <Spline size={18} />
          </button>

          <button
            onClick={() => setActiveShape("half-circle")}
            className={`w-8 h-8 p-1 cursor-pointer flex justify-center items-center rounded-md transition-colors ${
              activeShape === "half-circle"
                ? "bg-zinc-700 border border-zinc-600"
                : "bg-zinc-900 border border-neutral-800 hover:bg-zinc-800"
            }`}
            title="Half Circle">
            <CircleHalf size={18} strokeWidth={3} />
          </button>

          <div className="w-px h-6 bg-zinc-700 mx-1"></div>

          <button
            onClick={handleZoomOut}
            className="w-8 h-8 cursor-pointer flex justify-center items-center rounded-md bg-zinc-900 border border-neutral-800 hover:bg-zinc-800 transition-colors font-bold text-lg"
            title="Zoom Out">
            -
          </button>

          <button
            onClick={resetZoom}
            className="text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-zinc-800 transition-colors min-w-[50px]"
            title="Reset Zoom (100%)">
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            className="w-8 h-8 cursor-pointer flex justify-center items-center rounded-md bg-zinc-900 border border-neutral-800 hover:bg-zinc-800 transition-colors font-bold text-lg"
            title="Zoom In">
            +
          </button>
        </div>
      </div>

      {zoom !== 1 && (
        <div className="absolute bottom-4 left-4 bg-zinc-900 bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}
