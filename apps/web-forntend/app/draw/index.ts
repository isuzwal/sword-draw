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

}|{
      type: "text";
      x: number;
      y: number;
      text: string;
    };

// take the argument  to hit the backedend and web-scoket connction
export  async function DrawInit(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket,
    activeShape: "rectangle" | "circle" | "line" | "text"
){
  try{

    const ctx=canvas.getContext("2d");
    
    // gobal array of the Shape with fetching all shape for db 
    let exitingShape :Shape[]=await FetchingAllShape(roomId);
    
    if(!ctx){
      return;
    }
    // sokcet connection
    socket.onmessage=(event)=>{
      const message=JSON.parse(event.data);
     
      if(message==="chat"){
        const parsedShape=JSON.parse(message.message)
        exitingShape.push(parsedShape); 
        // re-render the canvas after something add to state
        clearCnavas(exitingShape ,canvas,ctx);
      }
    }
    clearCnavas(exitingShape ,canvas,ctx);
    let clicked=false;
    let startX=0;
    let startY=0;
    canvas.addEventListener("mousedown",(e)=>{
      clicked=true;
      startX=e.clientX;
      startY=e.clientY;
    })
    // when mouse is up
    canvas.addEventListener("mouseup",(e)=>{
      // have to fix scroolball options during canvas hight change 
      clicked=false;
      // re-cal of the hight  when the hight change
      const width=e.clientX-startX;
      const height=e.clientY-startY; 
      // push the shape of the shape after the  mouse-up 
       let shape: Shape;
      if (activeShape === "rectangle") {
        shape = { type: "rectangle", x: startX, y: startY, width, height };
      } else if (activeShape === "circle") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        shape = { type: "circle", centerX: startX, centerY: startY, radius };
      } else if (activeShape==="line"){
         shape={type:'line' ,  x1: startX,y1: startY, x2: e.clientX,y2: e.clientY,}

      // }else if (activeShape==='text'){
      //    shape={type: "text", x: e.clientX,y: e.clientY, text:,}
      // }
      }else{
        return ;
      }
            
          
      // sending the socket backend 
      exitingShape.push(shape)
      socket.send(JSON.stringify({
        roomId,
        type:"chat",
        message:JSON.stringify({
          shape,
        })
      }))
    })
    canvas.addEventListener("mousemove",(e)=>{
      
      if(clicked){
        const width=e.clientX-startX;
        const height=e.clientY-startY;      
        ctx.fillStyle="rgba(18,18,18,18)"; 
        // fill with new one
        clearCnavas(exitingShape,canvas,ctx)
        ctx.strokeStyle="rgba(255,255,255,1)";
        ctx.lineWidth = 1;
        // change the shape according to the type of the activeShape

       if (activeShape === "rectangle") {
          ctx.strokeRect(startX, startY, width, height);
        } else if (activeShape === "circle") {
          const radius = Math.sqrt(width * width + height * height) / 2;
          ctx.beginPath();
          ctx.arc(startX, startY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }else if(activeShape==='line'){
          ctx.beginPath(),
        ctx.moveTo(startX, startY);  
        ctx.lineTo(e.clientX, e.clientY);
          ctx.stroke()
        }else{
          return ;
        }
      }
    })
  }catch(err){
    console.log("Error At the Drawing part inde.ts--->",err)
  }
}

function clearCnavas(exitingShape:Shape[], canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.fillStyle = "black";  
  // claer the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
  // ctx.fillStyle="rgba(18,18,18,18)";
 // geeting the all exsting shaep from the backedn  here need to do for fextr and line also 
  exitingShape.map((shape)=>{
    if(shape.type=="rectangle"){
        ctx.strokeStyle="rgba(255,255,255,1)";
        ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
    }
      if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    if(shape.type==='line'){
      ctx.beginPath(),
      ctx.moveTo(shape.x1,shape.y1)
      ctx.lineTo(shape.y1,shape.y2)
    }
    if (shape.type === "text") {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(shape.text, shape.x, shape.y);
}
  })
}
 //  get the all drawing shape from the backend of the room 
 async function FetchingAllShape(roomId:string) {
  const token = localStorage.getItem("token");
  try{

    const res=await axios.get(`${HTTP_BACKNED}/chat/${roomId}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });

    const data = res?.data?.data?.chat ?? [];
    console.log("Fetching the all shapes ",data)
    const shapes=data.map((data:{message:string})=>{
      const messageshapes=JSON.parse(data.message)
      console.log("MessageSHAPE--->",messageshapes.shape)
      return messageshapes.shape;
    })
   
    return shapes;
  }catch(err){
    console.log("At the Fetching all shape-->",err)
    return []
  }
 }
