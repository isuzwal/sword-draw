export function DrawInit(canvas:HTMLCanvasElement){
  const ctx=canvas.getContext("2d");
  if(!ctx){
    return;
  }
  ctx.fillStyle="rgba(0,0,0,0)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  let clicked=false;
  let X=0;
  let Y=0;
  canvas.addEventListener("mousedown",(e)=>{
    clicked=true;
    X=e.clientX;
    Y=e.clientY;
  })
  // when mouse is up
  canvas.addEventListener("mouseup",(e)=>{
    clicked=false;
    X=e.clientX;
    Y=e.clientY;
    
  })
  canvas.addEventListener("mousemove",(e)=>{
 
    if(clicked){
        const width=e.clientX-X;
        const height=e.clientY-Y;      
         ctx.fillStyle="rgba(18,18,18,18)"; 
        // fill with new one
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle="rgba(255,255,255,1)";
           ctx.lineWidth = 1;
        ctx.strokeRect(X,Y,width,height)
    }
  })
}