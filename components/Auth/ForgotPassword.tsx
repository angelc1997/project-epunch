"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { app } from "@/lib/firebase";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { CircleChevronLeft } from "lucide-react";

const auth = getAuth(app);

// 表格驗證
const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "必填項目",
    })
    .email({
      message: "請輸入有效的電子郵件地址",
    }),
});

const ForgotPassword = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: "發送重設郵件成功",
        description: "請查看您的信箱並重設密碼",
      });
    } catch (error) {
      // console.error(error);
      toast({
        title: "發送重設郵件失敗",
        description: "請確認您的信箱是否正確",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>忘記密碼</CardTitle>
        <CardDescription>請填入信箱，系統將發送重設密碼的連結</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center text-base font-bold text-zinc-500">
                    信箱 <FormMessage className="text-base" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 border-0 text-base"
                      placeholder="請輸入信箱"
                      {...field}
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="w-full text-base">送出</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href="/login"
          className="flex items-center gap-2 justify-center text-cyan-600 hover:text-cyan-800 hover:underline transition-colors"
        >
          <CircleChevronLeft className="w-5 h-5" />
          <span>返回登入</span>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ForgotPassword;
