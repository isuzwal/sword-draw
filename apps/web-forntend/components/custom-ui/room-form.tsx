"use client";
import { LoaderCircle, X , RotateCw} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { HTTP_BACKNED } from "@/app/config";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useRouter } from "next/navigation";
import Link from "next/link";

import {  JoinRoomCanavas } from "@/app/draw";
interface Room {
  show: boolean;
  onShow: () => void;
}

export function RoomForm({ show, onShow }: Room) {
  const router=useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Array<{ id: string; slug: string }>>([]);
  const [name, setRoom] = useState<string>("");
  const [roomId,setRoomId]=useState("")
 
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  if (!show) return null;

  const handleroomcreate = async () => {
    if (!name.trim()) {
      toast.error("Room name is required");
      return;
    }
    if (!token) {
      toast.error("You must log in first");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${HTTP_BACKNED}/create-room`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || "Room created successfully");
      }
      setRoom("");
      
    } catch (err) {
      // @ts-ignore
      if (err.response) {
        // @ts-ignore
        toast.error(err.response.data.error || "Something went wrong");
      } else {
        toast.error("Networking error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleId = async () => {
    if (!token) {
      toast.error("You must log in first");
      return;
    }
    setLoading(true)
    try {
      const res = await axios.get(`${HTTP_BACKNED}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data.data || []); 
   
      toast.success("Rooms loaded");
    } catch (err) {
      toast.error("Could not load rooms");
    }finally{
      setLoading(false)
    }
  };

 const JoinRoom=async()=>{
  setLoading(true)
   try{
    await  JoinRoomCanavas(roomId)
     router.push(`/canvas/${roomId}`)
    }catch (err) {
      // @ts-ignore
      if (err.response) {
        // @ts-ignore
        toast.error(err.response.data.error || "Something went wrong");
      } else {
        // @ts-ignore
        toast.error(err?.response?.data?.message || "Failed to join room");
      }
    } finally{
    setLoading(false)
   }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white flex flex-col gap-2 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onShow}
          className="absolute top-2 right-3 text-neutral-600 hover:text-black cursor-pointer"
        >
          <X size={20} />
        </button>
        <Tabs defaultValue="create-room" className="p-1">
          <TabsList className="w-full">
            <TabsTrigger value="create-room" className="cursor-pointer">
              Create Room
            </TabsTrigger>
            <TabsTrigger
              value="get-room"
              className="cursor-pointer"
            >
              Get RoomId
            </TabsTrigger>
            <TabsTrigger value="join_room" className="cursor-pointer">
               Join room
            </TabsTrigger>
          </TabsList>

          {/* Create Room */}
          <TabsContent value="create-room">
            <Label className="flex flex-col items-start p-1">
              <h1 className="font-semibold text-gray-950 text-xl">Room name</h1>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRoom(e.target.value)
                }
                className="placeholder:text-neutral-500 text-sm font-medium"
                placeholder="drawing"
              />
            </Label>

            <Button
              onClick={handleroomcreate}
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer"
            >
              {loading ? (
                <div className="flex justify-center gap-2 items-center w-full">
                  <span className="text-sm">Creating your room</span>
                  <LoaderCircle className="animate-spin size-4" />
                </div>
              ) : (
                "Room Create"
              )}
            </Button>
          </TabsContent>

          {/* Get Rooms */}
          <TabsContent value="get-room">
            <Label className="flex  items-center justify-between px-3 py-1 ">
              <p className="font-semibold text-neutral-600 text-md">
                Your Rooms:
              </p>
              <div     onClick={handleId} className="bg-zinc-200 rounded-full  cursor-pointer  h-7 w-7 flex items-center justify-center shadow-xs border border-zinc-100 ">
               {loading ? (
                 <RotateCw size={18} className="text-neutral-600 animate-spin " />
                ):(
                 <RotateCw  size={18} className="text-neutral-600"/>
               )}
              </div>
            </Label>
            <div className="h-44  overflow-y-auto scrollbar-hide">
            {rooms.length > 0 ? (
              <div className="flex flex-col gap-2 border  border-slate-200 p-2 rounded-md shadow-sm">
                 {rooms.map((room ,idx)=>(
                   <div   key={idx} className="flex  p-2  rounded-md   border border-neutral-200   bg-neutral-100 shadow flex-col gap-1 ">
                  <h2 className="text-neutral-800 text-md font-semibold">Room name:{" "}{room.slug}</h2>
                  <p className="text-neutral-700 text-sm font-semibold">RoomId{" "}:{room.id}</p>
                  <Link  href={`/canvas/${room.id}`} className="w-full bg-black rounded-md p-2 text-neutral-200 font-semibold text-sm text-center">Join room</Link> 
                  </div>
                 ))}
            
                </div>
            ) : (
              <p className="text-sm font-medium text-gray-500 p-2">
                Reload the page  if did't show the  your rooms after create room . 
              </p>
            )}
            </div>
          </TabsContent>
          <TabsContent value="join_room">
            <div className="flex flex-col gap-2  items-start p-0">
              <p className="text-neutral-600 text-md font-semibold ">Enter the roomId</p>
              <Input value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder="1" />
              <Button  onClick={JoinRoom} className="w-full cursor-pointer">   {loading ? (
                <div className="flex justify-center gap-2 items-center w-full">
                  <span className="text-sm">Joining your room</span>
                  <LoaderCircle className="animate-spin size-4" />
                </div>
              ) : (
                "Enter roomId "
              )}</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
