"use client";
import { Swords, X, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { RoomForm } from "./room-form";

export function Navbarpage() {
  const [show, setShow] = useState<boolean>(false);
  const [expanded, setExpaned] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full rounded-lg mt-2 p-1 border border-neutral-200 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
      <div className="w-full flex items-center justify-between px-3 py-2">
        <Link
          href="/"
          className="flex border border-slate-200 gap-1 px-3 py-2 cursor-pointer items-center rounded-md text-neutral-600 font-semibold text-[10px]"
        >
          <Swords size="24" className="text-neutral-600" />
          <h1 className="md:text-md text-sm font-semibold">Sword-Sketch</h1>
        </Link>

        <RoomForm show={show} onShow={() => setShow(false)} />

        <div className="hidden     mr-10  sm:flex items-center gap-3">
          {token ? (
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => setShow(true)} className="w-full cursor-pointer">
                Create space
              </Button>
              <Link href={"/profile"} className="border border-slate-100  rounded-md">
                <Button variant={"secondary"}  className="cursor-pointer">Profile</Button>
              </Link>
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
              <Link href={"/profile"} className="border w-full border-slate-100 cursor-pointer rounded-md">
                <Button variant={"secondary"} className="w-full">
                  Profile
                </Button>
              </Link>
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
