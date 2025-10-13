"use client";
import { LoaderCircle, X, RotateCw } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { HTTP_BACKNED } from "@/app/config";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { JoinRoomCanavas } from "@/app/draw";
interface Room {
  show: boolean;
  onShow: () => void;
}
interface ErrorResponse {
  erorr: string;
}
export function RoomForm({ show, onShow }: Room) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Array<{ id: string; slug: string }>>([]);
  const [room_name, setRoom_name] = useState<string>("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  if (!show) return null;

  const handleroomcreate = async () => {
    if (!room_name.trim()) {
      toast.error("Room room-name is required");
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
        { room_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || "Room created successfully");
      }
      setRoom_name("");
    } catch (err) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        toast.error(err.response?.data?.erorr);
      } else {
        toast.warning("Networking error");
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
    setLoading(true);
    try {
      const res = await axios.get(`${HTTP_BACKNED}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data.data || []);

      toast.success("Rooms loaded");
    } catch (err) {
      toast.error("Could not load rooms");
    } finally {
      setLoading(false);
    }
  };

  const JoinRoom = async () => {
    setLoading(true);
    try {
      await JoinRoomCanavas(roomId);
      router.push(`/canvas/${roomId}`);
    } catch (err) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        toast.error(err.response?.data?.erorr);
      } else {
        toast.error("Fail to join room");
      }
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="bg-white dark:bg-neutral-900 flex flex-col gap-2 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onShow}
          className="absolute top-2 right-3 text-neutral-700 dark:text-neutral-50 cursor-pointer">
          <X size={20} />
        </button>
        <Tabs defaultValue="create-room" className="p-1">
          <TabsList className="w-full">
            <TabsTrigger value="create-room" className="cursor-pointer border-0">
              Create Room
            </TabsTrigger>
            <TabsTrigger value="get-room" className="cursor-pointer border-0">
              Get RoomId
            </TabsTrigger>
            <TabsTrigger value="join_room" className="cursor-pointer border-0">
              Join room
            </TabsTrigger>
          </TabsList>
      <CreateRoom
          loading={loading}
            setLoading={setLoading}
               setRoom={setRoom_name}
               room_name={room_name}
           handleRroomCreate={handleroomcreate}
       />
          <GetRoom  
            loading={loading}
            setLoading={setLoading}
            rooms={rooms}
            handleId={handleId}
           />
          <JoinTab
            roomId={roomId}
            loading={loading}
            setRoomId={setRoomId}
            JoinRoom={JoinRoom}
            setLoading={setLoading}
          />
        </Tabs>
      </div>
    </div>
  );
}

interface Props {
  roomId: string;
  setRoomId: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  JoinRoom: () => void;
}

const JoinTab = ({ roomId, JoinRoom, setRoomId, loading }: Props) => {
  return (
    <TabsContent value="join_room">
      <div className="flex flex-col gap-2  items-start p-0">
        <p className="text-neutral-600 text-md font-semibold ">Enter the roomId</p>
        <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="1" />
        <Button onClick={JoinRoom} className="w-full cursor-pointer">
          {" "}
          {loading ? (
            <div className="flex justify-center gap-2 items-center w-full">
              <span className="text-sm">Joining your room</span>
              <LoaderCircle className="animate-spin size-4" />
            </div>
          ) : (
            "Enter roomId "
          )}
        </Button>
      </div>
    </TabsContent>
  );
};

interface GetRoomProps {
   rooms: Array<{ id: string; slug: string }>;
  loading: boolean;
  setLoading: (value: boolean) => void;
  handleId: () => void;
}

const GetRoom = ({ loading, rooms, handleId }: GetRoomProps) => {
  return (
    <TabsContent value="get-room">
      <Label className="flex  items-center justify-between px-3 py-1 ">
        <p className="font-semibold text-neutral-400 text-md">Your Rooms:</p>
        <button
          onClick={handleId}
          className=" dark:border-neutral-900 dark:bg-neutral-800 rounded-full  cursor-pointer  h-7 w-7 flex items-center justify-center border border-zinc-100  bg-neutral-100 shadow-xl">
          {loading ? (
            <RotateCw size={18} className="text-neutral-400 animate-spin " />
          ) : (
            <RotateCw size={18} className="text-neutral-400" />
          )}
        </button>
      </Label>
      <div className="h-44  overflow-y-auto scrollbar-hide border-0">
        {rooms.length > 0 ? (
          <div className="flex flex-col gap-2  dark:bg-zinc-800 dark:border-zinc-800 p-2 rounded-md ">
            {rooms.map((room, idx) => (
              <div
                key={idx}
                className="flex  p-2   dark:text-neutral-400   text-neutral-700 rounded-md  dark:bg-neutral-900 dark:border-neutral-800  border border-neutral-200   bg-neutral-100  flex-col gap-1 ">
                <h2 className=" text-md font-semibold">Room room_name: <span className="text-neutral-500">{room.slug}</span></h2>
                <p className="text-sm font-semibold">RoomId :<span className="text-neutral-500">{room.id}</span></p>
                <Link
                  href={`/canvas/${room.id}`}
                  className="w-full bg-black rounded-md p-2 text-neutral-200 font-semibold text-sm text-center">
                  Join room
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px]  font-medium  dark:text-neutral-400 text-neutral-500 p-2">
            Reload the page if did't show the your rooms after create room .
          </p>
        )}
      </div>
    </TabsContent>
  );
};


interface Roomcreate{
  loading: boolean;
  setLoading: (value: boolean) => void;
  room_name:string
  setRoom:(value:string)=>void
  handleRroomCreate:()=>void
}
const CreateRoom=({loading,setRoom,handleRroomCreate,room_name}:Roomcreate)=>{
  return(
             <TabsContent value="create-room">
            <Label className="flex flex-col items-start p-1">
              <h1 className="font-semibold dark:text-neutral-200 text-neutral-600 text-xl">
                Room name
              </h1>
              <Input
                value={room_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoom(e.target.value)}
                className=" text-sm font-medium"
                placeholder="drawing"
              />
            </Label>

            <Button
              onClick={handleRroomCreate}
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer">
              {loading ? (
                <div className="flex justify-center gap-2 items-center w-full">
                  <span className="text-sm text-neutral-500 dark:text-white">
                    Creating your room
                  </span>
                  <LoaderCircle className="animate-spin size-4" />
                </div>
              ) : (
                "Room Create"
              )}
            </Button>
          </TabsContent>
  )
}