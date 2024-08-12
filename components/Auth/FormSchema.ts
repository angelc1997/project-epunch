import * as z from "zod";

export const formSchema = z.object({
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
