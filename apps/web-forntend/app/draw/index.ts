import axios from "axios";
import { HTTP_BACKNED } from "../config";
type Shape={
    type:"rectangle"
    x:number,
    y:number,
    width:number,
    height:number,
} | {
    type:"cricle",
     centerX:number,
     centerY:number,
     radius:number,
}
// take the argument 
export  async function DrawInit(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
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
      console.log("At thre message in scoket--->",message)
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
      const shape:Shape={
        type:"rectangle",
        x:startX,
        y:startY,
        width,
        height,
      }
      // sending the socket backend 
      exitingShape.push(shape)
      socket.send(JSON.stringify({
        type:"chat",
        message:JSON.stringify({
          shape
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
        ctx.strokeRect(startX,startY,width,height)
      }
    })
  }catch(err){
    console.log("Error At the Drawing part inde.ts--->",err)
  }
}

function clearCnavas(exitingShape:Shape[], canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    // claer the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="rgba(18,18,18,18)";

  exitingShape.map((shape)=>{
    if(shape.type=="rectangle"){
        ctx.strokeStyle="rgba(255,255,255,1)";
        ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
    }
  })
}

 async function FetchingAllShape(roomId:string) {
   const res=await axios.get(`${HTTP_BACKNED}/chat/${roomId}`);
   const data=res.data.chata;

    // need to define the type of the message 
    // object of the message 
    const shapes=data.map((data:{message:string})=>{
     const messageshapes=JSON.parse(data.message)
       return messageshapes;
 })
 return shapes;
 }