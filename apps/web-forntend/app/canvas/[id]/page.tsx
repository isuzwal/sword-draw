 "use client"
 import { DrawInit } from "@/app/draw"
import { useEffect, useRef } from "react"

export default function Page(){
    
 const canvasRef=useRef<HTMLCanvasElement >(null);
 useEffect(()=>{
   if(canvasRef.current){
       DrawInit(canvasRef.current)
   }
 },[])
    return(
        <div>
            Draw-canvas
            <canvas  ref={canvasRef} width={1000} height={1000

            } className="">

            </canvas>
        </div>
    )
}