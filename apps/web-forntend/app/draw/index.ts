import axios from "axios";
import { HTTP_BACKNED } from "../config";

type Shape =
  | { type: "rectangle"; x: number; y: number; width: number; height: number ,color:string }
  | { type: "circle"; centerX: number; centerY: number; radius: number,color:string }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number,color:string }
  | { type: "ellipse"; centerX: number; centerY: number; radiusX: number; radiusY: number; rotation?: number,color:string }
  | { type: "curve"; startX: number; startY: number; cp1x: number; cp1y: number; cp2x: number; cp2y: number; endX: number; endY: number,color:string }
  | {type: "half-circle"; centerX: number; centerY: number; radius: number; direction?: "top" | "bottom" | "left" | "right" ,color:string;}

export async function DrawInit(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  activeShapeRef: React.MutableRefObject<"rectangle" | "circle" | "line" | "ellipse" | "curve" | "half-circle">,
  zoomRef: React.MutableRefObject<number>,
  setZoom: React.Dispatch<React.SetStateAction<number>>,
  color:React.MutableRefObject<string>
) {
  try {
    const ctx = canvas.getContext("2d");
    let exitingShape: Shape[] = await FetchingAllShape(roomId);

    if (!ctx) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const newShape = message.content;
        if (newShape && isValidShape(newShape)) {
          exitingShape.push(newShape);
          clearCanvas(exitingShape, canvas, ctx, zoomRef.current);
        }
      }
    };

    clearCanvas(exitingShape, canvas, ctx, zoomRef.current);    
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomAmount = 0.1;
      let newZoom = zoomRef.current;
      
      if (e.deltaY < 0) {
        newZoom += zoomAmount;
      } else {
        newZoom = Math.max(0.1, newZoom - zoomAmount); 
      }
      zoomRef.current = newZoom;
      setZoom(newZoom);
      clearCanvas(exitingShape, canvas, ctx, newZoom);
    });

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
      clicked = true;
      const rect = canvas.getBoundingClientRect();
   
      startX = (e.clientX - rect.left) / zoomRef.current;
      startY = (e.clientY - rect.top) / zoomRef.current;
    });

    canvas.addEventListener("mouseup", (e) => {
      if (!clicked) return;
      clicked = false;

      const rect = canvas.getBoundingClientRect();
      // Adjust coordinates for zoom
      const endX = (e.clientX - rect.left) / zoomRef.current;
      const endY = (e.clientY - rect.top) / zoomRef.current;
      const width = endX - startX;
      const height = endY - startY;

      let shape: Shape;
      const currentActiveShape = activeShapeRef.current;

      if (currentActiveShape === "rectangle") {
        shape = { type: "rectangle", x: startX, y: startY, width, height ,color:color.current};
      } else if (currentActiveShape === "circle") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        shape = { type: "circle", centerX: startX, centerY: startY, radius,color:color.current };
      } else if (currentActiveShape === "line") {
        shape = { type: "line", x1: startX, y1: startY, x2: endX, y2: endY, color:color.current };
      } else if (currentActiveShape === "ellipse") {
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        shape = { type: "ellipse", centerX, centerY, radiusX, radiusY, rotation: 0 ,color:color.current};
      } else if (currentActiveShape === "curve") {
        const cp1x = (startX + endX) / 2;
        const cp1y = startY - 50;
        const cp2x = (startX + endX) / 2;
        const cp2y = endY + 50;
        shape = { type: "curve", startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY,color:color.current };
      } else if (currentActiveShape === "half-circle") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        shape = {
          type: "half-circle",
          centerX,
          centerY,
          radius,
          direction: "bottom",
          color:color.current
        };
      } else {
        return;
      }

      exitingShape.push(shape);
      clearCanvas(exitingShape, canvas, ctx, zoomRef.current);

      socket.send(
        JSON.stringify({
          roomId,
          type: "chat",
          message: { content: shape },
        })
      );
    });

    canvas.addEventListener("mousemove", (e) => {
      if (clicked) {
        const rect = canvas.getBoundingClientRect();
        // Adjust coordinates for zoom
        const currentX = (e.clientX - rect.left) / zoomRef.current;
        const currentY = (e.clientY - rect.top) / zoomRef.current;
        const width = currentX - startX;
        const height = currentY - startY;
        const currentActiveShape = activeShapeRef.current;

        clearCanvas(exitingShape, canvas, ctx, zoomRef.current);

        // Save the current transform before drawing preview
        ctx.save();
        ctx.scale(zoomRef.current, zoomRef.current);
        ctx.strokeStyle = currentActiveShape;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        if (currentActiveShape === "rectangle") {
          ctx.strokeRect(startX, startY, width, height);
             ctx.strokeStyle=color.current
        } else if (currentActiveShape === "circle") {
          const radius = Math.sqrt(width * width + height * height) / 2;
          ctx.strokeStyle=color.current
          ctx.beginPath();
          ctx.arc(startX, startY, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (currentActiveShape === "line") {
          ctx.beginPath();
             ctx.strokeStyle=color.current
          ctx.moveTo(startX, startY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        } else if (currentActiveShape === "ellipse") {
             ctx.strokeStyle=color.current
          const radiusX = Math.abs(width) / 2;
          const radiusY = Math.abs(height) / 2;
          const centerX = startX + width / 2;
          const centerY = startY + height / 2;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (currentActiveShape === "curve") {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
      ctx.strokeStyle=color.current
          const cp1x = (startX + currentX) / 2;
          const cp1y = startY - 50;
          const cp2x = (startX + currentX) / 2;
          const cp2y = currentY + 50;

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, currentX, currentY);
          ctx.stroke();
        } else if (currentActiveShape === "half-circle") {
          const radius = Math.sqrt(width * width + height * height) / 2;
             ctx.strokeStyle=color.current
          const centerX = startX + width / 2;
          const centerY = startY + height / 2;
          const direction: "bottom" = "bottom";

          ctx.beginPath();
          if (direction === "bottom") ctx.arc(centerX, centerY, radius, 0, Math.PI);
          else if (direction === "left") ctx.arc(centerX, centerY, radius, 0.5 * Math.PI, 1.5 * Math.PI);
          else if (direction === "right") ctx.arc(centerX, centerY, radius, 1.5 * Math.PI, 0.5 * Math.PI);
          ctx.stroke();
        }
        
        ctx.restore();
        ctx.setLineDash([]);
      }
    });
  } catch (err) {
    console.log("Error in DrawInit:", err);
    return err;
  }
}

function clearCanvas(exitingShape: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale = 1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineWidth = 2;

  exitingShape.forEach((shape) => {
    ctx.beginPath();
    ctx.strokeStyle=shape.color || "#000"
    if (shape.type === "rectangle") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
         ctx.strokeStyle=shape.color
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "line") {
      ctx.beginPath();
    
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    } else if (shape.type === "ellipse") {
      ctx.beginPath();
      ctx.strokeStyle=""
      ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "curve") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.bezierCurveTo(shape.cp1x, shape.cp1y, shape.cp2x, shape.cp2y, shape.endX, shape.endY);
      ctx.stroke();
    } else if (shape.type === "half-circle") {
      ctx.beginPath();
      const { centerX, centerY, radius, direction } = shape;
      if (direction === "top") ctx.arc(centerX, centerY, radius, Math.PI, 0);
      else if (direction === "bottom") ctx.arc(centerX, centerY, radius, 0, Math.PI);
      else if (direction === "left") ctx.arc(centerX, centerY, radius, 0.5 * Math.PI, 1.5 * Math.PI);
      else if (direction === "right") ctx.arc(centerX, centerY, radius, 1.5 * Math.PI, 0.5 * Math.PI);
      ctx.stroke();
    }
  });
  
  ctx.restore();
}

function isValidShape(shape: any): shape is Shape {
  if (!shape || typeof shape !== "object") return false;

  switch (shape.type) {
    case "rectangle":
      return typeof shape.x === "number" && typeof shape.y === "number" && typeof shape.width === "number" && typeof shape.height === "number";
    case "circle":
      return typeof shape.centerX === "number" && typeof shape.centerY === "number" && typeof shape.radius === "number";
    case "line":
      return typeof shape.x1 === "number" && typeof shape.y1 === "number" && typeof shape.x2 === "number" && typeof shape.y2 === "number";
    case "ellipse":
      return typeof shape.centerX === "number" && typeof shape.centerY === "number" && typeof shape.radiusX === "number" && typeof shape.radiusY === "number";
    case "curve":
      return (
        typeof shape.startX === "number" &&
        typeof shape.startY === "number" &&
        typeof shape.cp1x === "number" &&
        typeof shape.cp1y === "number" &&
        typeof shape.cp2x === "number" &&
        typeof shape.cp2y === "number" &&
        typeof shape.endX === "number" &&
        typeof shape.endY === "number"
      );
    case "half-circle":
      return typeof shape.centerX === "number" && typeof shape.centerY === "number" && typeof shape.radius === "number";
    default:
      return false;
  }
}

export async function FetchingAllShape(roomId: string): Promise<Shape[]> {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get(`${HTTP_BACKNED}/chat/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = res?.data?.data?.chat ?? [];
        const content = data.map((d: any) => d.content).filter(isValidShape);
        console.log("Form the backend ", content)
        return content;
    } catch(err) {
        console.log("Error fetching shapes:", err);
        return [];
    }
}

export async function JoinRoomCanavas(roomId: string): Promise<Shape[]> {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get(`${HTTP_BACKNED}/chat/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = res?.data?.data?.chat ?? [];
        const content = data.map((d: any) => d.content).filter(isValidShape);
        console.log("Form the backend ", content)
        return content;
    } catch(err) {
        console.log("Error fetching shapes:", err);
        return [];
    }
}