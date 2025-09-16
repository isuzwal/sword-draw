"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { HTTP_BACKNED } from "@/app/config";

const SigupFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 letter" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Initaliz stage of the Form
  const form = useForm<z.infer<typeof SigupFormSchema>>({
    resolver: zodResolver(SigupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function handleLogin(values: z.infer<typeof SigupFormSchema>) {
    setLoading(true);
    try {
      const res = await axios.post(`${HTTP_BACKNED}/signup`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || "Account create successfully");
        router.push("/login");
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.error || "Something went  wrong ");
      } else {
        toast.error("Networking error");
      }
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
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <div className="text-center flex  flex-col items-center">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-gray-600 text-sm ">
                    Quick, simple, and secure —your space to start building.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-md p-1">Username</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Jon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-md p-1">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md p-2 cursor-pointer font-medium ">
                  {loading ? (
                    <div className="flex  justify-center gap-2 items-center w-full ">
                      <span className="text-sm">Creating your account </span>
                      <LoaderCircle className="animate-spin size-4" />
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold underline underline-offset-4">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
