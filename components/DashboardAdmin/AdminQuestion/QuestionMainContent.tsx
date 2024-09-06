"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "姓名至少需要2個字符",
  }),
  email: z.string().email({
    message: "請輸入有效的電子郵件地址",
  }),
  phone: z.string().min(8, {
    message: "請輸入有效的電話號碼",
  }),
  topic: z.string({
    required_error: "請選擇諮詢主題",
  }),
  message: z.string().min(10, {
    message: "訊息至少需要10個字符",
  }),
});

type AdminInfo = {
  name: string;
  email: string;
};

const QuestionMainContent = ({ name, email }: AdminInfo) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      email: email,
      phone: "",
      topic: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
      toast({
        title: "提交表單成功",
        description: "我們會盡快與您聯繫。",
      });
      form.reset({
        name: name,
        email: email,
        phone: "",
        topic: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "提交表單失敗",
        description: "請稍後再試。",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      id="section-bookingForm"
      className="relative border-slate-200 border-2 rounded-3xl overflow-hidden mt-10"
    >
      <div className="absolute right-[-20px] top-[-20px] w-[80px] h-[80px] rounded-full linear-circle"></div>
      <div className="absolute right-[300px] md:right-[500px] lg:right-[700px] top-[50px] w-[40px] h-[40px] rounded-full linear-circle -z-10"></div>
      <h2 className="text-3xl font-bold mb-6 text-center mt-10">客服諮詢</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-10">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>姓名</FormLabel>
                  <FormMessage />
                </div>

                <FormControl>
                  <Input placeholder="請輸入您的姓名" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>信箱</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder="請輸入您的電子郵件" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>電話</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input placeholder="請輸入您的電話號碼" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>諮詢主題</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇諮詢類型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">一般諮詢</SelectItem>
                    <SelectItem value="pricing">價格諮詢</SelectItem>
                    <SelectItem value="technical">技術諮詢</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>諮詢內容</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Textarea
                    placeholder="請詳細描述諮詢內容"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg">
            提交諮詢
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuestionMainContent;
