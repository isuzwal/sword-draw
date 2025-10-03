"use client";
import { useEffect, useRef } from "react";
import { DrawInit } from "../draw";
import {
  Square,
  Circle,
  Minus,
  Type,
  Eclipse,
  Spline,
  Camera,
  PanelLeftOpen,
  PanelRightOpen,
  User2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { Userdata } from "../draw/user";
import { CircleHalf } from "phosphor-react";

export function MainCanvasPage({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userdata, setData] = useState<any>(null)
  const [zoom, setZoom] = useState(1);
  const [Isopen, SetOpen] = useState<boolean>(true);
  const [color, setColor] = useState("#f9f5f1");
    const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [activeShape, setActiveShape] = useState<
    "rectangle" | "circle" | "line" | "ellipse" | "curve" | "half-circle"
  >("rectangle");
 
  const isInitializedRef = useRef(false);
  const activeShapeRef = useRef(activeShape);
  const zoomRef = useRef(zoom);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await Userdata();
        setData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setData(null);
      }
    };
    fetchUser();
  }, []); 

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    activeShapeRef.current = activeShape;
  }, [activeShape]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
const colorRef = useRef(color);

useEffect(() => {
  colorRef.current = color;
}, [color]);
  useEffect(() => {
    if (canvasRef.current && !isInitializedRef.current) {
      DrawInit(canvasRef.current, roomId, socket, activeShapeRef, zoomRef, setZoom,colorRef);
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

  const colors: string[] = ["#f9f5f1","#ff0000", "#00a86b", "#4fa3d9", "#ffc800", "#ff878d", "#082a40","#d948cc"];

  return (
    <div className="relative">
      <canvas ref={canvasRef}  
      width={dimensions.width}
      height={dimensions.height}className="bg-black cursor-crosshair" />
        
   
     <div className="absolute top-2 right-2 rounded-lg bg-zinc-950 bg-opacity-90 border border-zinc-900 shadow-lg">
          {userdata && (
            <div className="flex items-center gap-2 px-3 py-2 text-neutral-300">
              <User2Icon size={16} />
              <span className="text-sm font-medium">{userdata.name || 'User'}</span>
            </div>
          )}
     </div>
      <div className="absolute top-2 w-full flex items-center justify-center px-2">
        <button
          className="absolute left-3  top-14 bg-zinc-800 text-neutral-400   shadow rounded-md p-[2px] border border-zinc-800   cursor-pointer "
          onClick={() => SetOpen((prev) => !prev)}>
          {Isopen ? <PanelRightOpen /> : <PanelLeftOpen />}
        </button>
        {Isopen && (
          <div className="   transition duration-300  flex  flex-col items-start justify-center absolute left-1 top-24 text-white  bg-zinc-950 border border-zinc-800 w-auto  h-auto  shadow-2xs  rounded-md p-2 ">
            {colors.map((col) => (
              <button
                key={col}
                onClick={() => setColor(col)}
                style={{
                  backgroundColor: col,
                  border: color === col ? " black" : "transparent",
                }}
                className={` rounded-md flex   m-[1.5px] cursor-pointer  w-7 h-7 `}
              />
            ))}
          </div>
        )}
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
        <div className="absolute bottom-4  right-1 bg-zinc-900 bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}

