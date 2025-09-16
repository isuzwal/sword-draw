import { LoaderCircle, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
interface Room {
  show: boolean;
  onShow: () => void;
}
export function RoomForm({ show, onShow }: Room) {
  const [room, setRoom] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white flex flex-col gap-2  rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onShow}
          className="absolute top-3 right-3 text-neutral-600 hover:text-black  cursor-pointer">
          <X size={20} />
        </button>
        <Label className="flex flex-col items-start p-1">
          <h1 className="font-semibold text-gray-950  text-xl">Room name</h1>
          <Input
            value={room}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoom(e.target.value)}
            className=" placeholder:text-neutral-500 text-sm font-medium"
            placeholder="drawing"
          />
        </Label>

        <Button type="submit" disabled={loading} className="mt-2 w-full  cursor-pointer">
          {loading ? (
            <div className="flex  justify-center gap-2 items-center w-full ">
              <span className="text-sm">Creating your room </span>
              <LoaderCircle className="animate-spin size-4" />
            </div>
          ) : (
            "Room Create "
          )}
        </Button>
      </div>
    </div>
  );
}
