"use client";
import { Swords, X, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { RoomForm } from "./room-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function Navbarpage() {
  const router=useRouter()
  const [show, setShow] = useState<boolean>(false);
  const [expanded, setExpaned] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
 
  const handleLogout=async()=>{
    try{
      localStorage.removeItem("token")
     router.push('/login')
    } catch(error:any){
      toast.error('Pleas try  agian !')
    }
  }
  return (
    <div className="rounded-xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 shadow-sm">
      <div className="w-full flex items-center justify-between px-2 py-2">
        <Link
          href="/"
          className="flex gap-2 px-3 py-2 transition duration-300 cursor-pointer items-center rounded-lg text-neutral-700 hover:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-300"
        >
          <Swords size="20" className="text-purple-500" />
          <h1 className="text-base font-semibold tracking-tight">PrismArt</h1>
        </Link>

        <RoomForm show={show} onShow={() => setShow(false)} />

        <div className="hidden mr-3 sm:flex items-center gap-3">
          {token ? (
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => setShow(true)} className="w-full cursor-pointer">
                Create space
              </Button>
              <Button onClick={handleLogout} variant={'destructive'} className="w-full cursor-pointer">
                Logout
              </Button>
            </div>
          ) : (
           <Button className="cursor-pointer w-full">
            <Link  href={"/login"}>Login</Link>
           </Button>
          )}
        </div>

        <div className="sm:hidden flex items-center">
          <button onClick={() => setExpaned(!expanded)} className="cursor-pointer">
            {expanded ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="sm:hidden flex flex-col items-start gap-2 px-3 py-3">
          {token ? (
            <>
              <Button onClick={() => setShow(true)} className="w-full">
                Create space
              </Button>
              <Button onClick={handleLogout} variant={'destructive'} className="w-full cursor-pointer">
                Logout
              </Button>
            </>
          ) : (
            <Button className="cursor-pointer w-full">
            <Link  href={"/login"}>Login</Link>
           </Button>
          )}
        </div>
      )}
    </div>
  );
}
