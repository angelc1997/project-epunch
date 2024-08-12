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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { FirebaseError } from "firebase/app";

const auth = getAuth(app);
const db = getFirestore(app);

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
  password: z.string().min(6, {
    message: "密碼至少 6 個字元",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;
      if (user) {
        const userUid = user.uid;
        const docRef = doc(db, "admins", userUid);
        console.log("docRef", docRef);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const adminData = docSnap.data();
          if (adminData.sys === "admin") {
            router.push(`/admin/${userUid}`);
            toast({
              title: "登入成功",
              description: "歡迎回到ePunch點點班平台",
            });
          } else {
            toast({
              title: "登入失敗",
              description: "權限不足",
            });
          }
        } else {
          const adminsSnapshot = await getDocs(collection(db, "admins"));
          let userFound = false;

          // 瀏覽每一個doc
          for (const admin of adminsSnapshot.docs) {
            const userQuery = query(
              collection(db, "admins", admin.id, "users"),
              where("email", "==", data.email)
            );
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              if (userData.sys === "user") {
                router.push(`/user/${userUid}/dailyrecord`);
                toast({
                  title: `${userData.name} 登入成功`,
                  description: "歡迎回到ePunch點點班平台",
                });
                userFound = true;
                break;
              } else {
                toast({
                  title: "登入失敗",
                  description: "權限不足",
                });
                userFound = true;
                break;
              }
            }
          }

          if (!userFound) {
            toast({
              title: "登入失敗",
              description: "用戶不存在",
            });
          }
        }
      }
    } catch (error: FirebaseError | any) {
      switch (error.code) {
        case "auth/user-not-found":
          toast({
            title: "用戶不存在",
            description: "請確認您輸入的電子郵件地址是否正確",
          });
          break;
        case "auth/wrong-password":
          toast({
            title: "密碼錯誤",
            description: "請確認您輸入的密碼是否正確",
          });
          break;
        default:
          toast({
            title: "登入錯誤",
            description: `${error.message}`,
          });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>登入系統</CardTitle>
        <CardDescription>
          請先註冊管理員，並添加您的個人資料以登入系統
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center text-xs font-bold text-zinc-500">
                    信箱 <FormMessage className="text-xs" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 border-0"
                      placeholder="請輸入信箱"
                      {...field}
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center text-xs font-bold text-zinc-500">
                    密碼 <FormMessage className="text-xs" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-slate-100 border-0"
                      placeholder="請輸入密碼"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="w-full">登入</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
