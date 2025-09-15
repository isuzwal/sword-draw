"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { HTTP_BACKNED } from "@/app/config";
import axios from "axios";
import { useRouter } from "next/navigation";
const LoginFormSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(values: z.infer<typeof LoginFormSchema>) {
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_BACKNED}/login`, {
        email: values.email,
        password: values.password,
      });
      const token=res.data.token;
       localStorage.setItem("token",token);
      if (res.status === 200 || res.status === 201) {
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="group mb-4 flex items-center gap-1 text-sm">
          <ArrowLeft size={14} className="transition-colors group-hover:text-gray-500" />
          <span className="transition-colors group-hover:text-gray-500">Back</span>
        </Link>

        <div>
          <div className="p-6 rounded-2xl border border-neutral-200 shadow">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-md p-1">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="p-1.5 placeholder:text-neutral-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-md p-1">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          className="p-1.5 placeholder:text-neutral-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black rounded-md p-2 cursor-pointer font-medium text-sm text-white ">
                  {loading ? <div  className="flex w-full justify-center items-center gap-2 ">
                    <span>Creating your space</span> <LoaderCircle  className="animate-spin size-4" />
                  </div> : "Login"}
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center text-sm">
              Didn’t have an account?{" "}
              <Link href="/signup" className="font-semibold underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
