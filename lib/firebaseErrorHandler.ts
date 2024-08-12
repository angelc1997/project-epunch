import { FirebaseError } from "firebase/app";
import { useToast } from "@/components/ui/use-toast";

interface ErrorToastValue {
  title: string;
  description: string;
}

const getError = (error: FirebaseError): ErrorToastValue => {
  switch (error.code) {
    case "auth/user-not-found":
      return {
        title: "用戶不存在",
        description: "請確認您輸入的電子郵件地址是否正確",
      };
    case "auth/wrong-password":
      return {
        title: "密碼錯誤",
        description: "請確認您輸入的密碼是否正確",
      };
    case "auth/invalid-credential":
      return {
        title: "無效憑證",
        description: "請確保您已註冊管理員或被新增至管理名單中",
      };
    case "auth/email-already-in-use":
      return {
        title: "電子郵件已被使用",
        description: "請重新註冊或登入電子郵件",
      };
    case "auth/weak-password":
      return {
        title: "密碼強度不足",
        description: "請使用更強的密碼（至少6個字符）",
      };
    default:
      return {
        title: "發生錯誤",
        description: error.message || "請稍後再試",
      };
  }
};

export const getErrorToast = (error: unknown): ErrorToastValue => {
  if (error instanceof FirebaseError) {
    return getError(error);
  } else {
    console.error("未知錯誤:", error);
    return {
      title: "未知錯誤",
      description: "發生了未知錯誤，請稍後再試",
    };
  }
};
