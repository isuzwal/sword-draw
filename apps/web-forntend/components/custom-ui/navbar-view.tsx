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
      toast.error('Something went wrong try  again !')
    }
  }
  return (
    <div className=" rounded-xl mt-2   border border-neutral-200 ">
      <div className="w-full flex items-center justify-between px-3 py-2">
        <Link
          href="/"
          className="flex  gap-1 px-3 py-2 transition duration-300  cursor-pointer items-center rounded-md text-neutral-700  hover:text-neutral-400 "
        >
          <Swords size="20" className="text-purple-500" />
          <h1 className="text-base font-semibold">PrismArt</h1>
        </Link>

        <RoomForm show={show} onShow={() => setShow(false)} />

        <div className="hidden     mr-10  sm:flex items-center gap-3">
          {token ? (
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => setShow(true)} className="w-full cursor-pointer">
                Create space
              </Button>
               <div className="border w-full border-slate-100  rounded-md">
                <Button onClick={handleLogout}  variant={'destructive'} className="w-full cursor-pointer">
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="inline-block cursor-pointer items-center justify-center rounded-md border-[1.58px] border-zinc-600 bg-zinc-950 px-2 py-1 font-medium text-slate-200 shadow-md"
            >
              Login
            </Link>
          )}
        </div>

        <div className="sm:hidden flex items-center">
          <button onClick={() => setExpaned(!expanded)} className="cursor-pointer">
            {expanded ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="sm:hidden flex flex-col items-start gap-2 px-3 py-2 border-t">
          {token ? (
            <>
              <Button onClick={() => setShow(true)} className="w-full">
                Create space
              </Button>
              <div className="border w-full border-slate-100  rounded-md">
                <Button  onClick={handleLogout}  variant={'destructive'} className="w-full cursor-pointer">
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link
              href={"/login"}
              className="w-full inline-block cursor-pointer items-center justify-center rounded-md border-[1.58px] border-zinc-600 bg-zinc-950 px-3 py-2 font-medium text-slate-200 shadow-md text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
