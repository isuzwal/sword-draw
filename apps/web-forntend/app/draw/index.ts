import axios from "axios";
import { HTTP_BACKNED } from "../config";

type Shape={
    type:"rectangle"
    x:number,
    y:number,
    width:number,
    height:number,
} | {
    type:"circle",
     centerX:number,
     centerY:number,
     radius:number,
} | {
 type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
}

export async function DrawInit(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  activeShapeRef: React.MutableRefObject<"rectangle" | "circle" | "line">
) {
  try{
    const ctx=canvas.getContext("2d");
     
    // Global array of shapes fetched from DB 
    let exitingShape: Shape[] = await FetchingAllShape(roomId);
    
    if(!ctx){
      return;
    }

    // Fixed WebSocket message handler
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      // Only process messages of type "chat" from other users
      if(message.type === "chat") {
        const newShape = message.content;
        if(newShape && isValidShape(newShape)) {
          exitingShape.push(newShape); 
          clearCanvas(exitingShape, canvas, ctx);
        }
      }
    }

    clearCanvas(exitingShape, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
      clicked = true;
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
    })

    canvas.addEventListener("mouseup", (e) => {
      if(!clicked) return;
      
      clicked = false;
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      const width = endX - startX;
      const height = endY - startY;

      let shape: Shape;
      const currentActiveShape = activeShapeRef.current; 
      
      if (currentActiveShape === "rectangle") {
        shape = { type: "rectangle", x: startX, y: startY, width, height };
      } else if (currentActiveShape === "circle") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        shape = { type: "circle", centerX: startX, centerY: startY, radius };
      } else if (currentActiveShape === "line") {
         shape = { type: 'line', x1: startX, y1: startY, x2: endX, y2: endY };
      } else {
        return;
      }

      // Add to local state immediately for instant feedback
      exitingShape.push(shape);
      clearCanvas(exitingShape, canvas, ctx);

      console.log("Sending shape to WebSocket:", shape);

      // Send to WebSocket (backend will save and broadcast to others)
      socket.send(JSON.stringify({
        roomId,
        type: "chat",
        message: {
          content: shape
        }
      }));
    })

    canvas.addEventListener("mousemove", (e) => {
      if(clicked) {
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const width = currentX - startX;
        const height = currentY - startY;
        const currentActiveShape = activeShapeRef.current; // Get current active shape
        
        // Clear and redraw existing shapes
        clearCanvas(exitingShape, canvas, ctx);
        
        // Draw preview of current shape
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed line for preview
        
        if (currentActiveShape === "rectangle") {
          ctx.strokeRect(startX, startY, width, height);
        } else if (currentActiveShape === "circle") {
          const radius = Math.sqrt(width * width + height * height) / 2;
          ctx.beginPath();
          ctx.arc(startX, startY, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (currentActiveShape === 'line') {
          ctx.beginPath();
          ctx.moveTo(startX, startY);  
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        }
        
        ctx.setLineDash([]); // Reset dash
      }
    })
  } catch(err) {
    console.log("Error in DrawInit:", err);
  }
}

function clearCanvas(exitingShape: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set default styles
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = 2;
    
    exitingShape.forEach((shape) => {
        if(shape.type === "rectangle") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        else if(shape.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2); 
            ctx.stroke();
        }
    });
}


function isValidShape(shape: any): shape is Shape {
    if (!shape || typeof shape !== 'object') return false;
    
    switch(shape.type) {
        case 'rectangle':
            return typeof shape.x === 'number' && 
                   typeof shape.y === 'number' && 
                   typeof shape.width === 'number' && 
                   typeof shape.height === 'number';
        case 'circle':
            return typeof shape.centerX === 'number' && 
                   typeof shape.centerY === 'number' && 
                   typeof shape.radius === 'number';
        case 'line':
            return typeof shape.x1 === 'number' && 
                   typeof shape.y1 === 'number' && 
                   typeof shape.x2 === 'number' && 
                   typeof shape.y2 === 'number';
        default:
            return false;
    }
}

// Get all drawing shapes from the backend for a room 
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
        console.log("Form the backedn ",content)
        return content;
    } catch(err) {
        console.log("Error fetching shapes:", err);
        return [];
    }
}
// Get all drawing shapes from the backend for a room 
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
        console.log("Form the backedn ",content)
        return content;
    } catch(err) {
        console.log("Error fetching shapes:", err);
        return [];
    }
}
