import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { app } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { Description } from "@radix-ui/react-toast";

export const auth = getAuth(app);
export const db = getFirestore(app);

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const handleAuthError = (error: FirebaseError) => {
  switch (error.code) {
    case "auth/user-not-found":
      return {
        title: "使用者不存在",
        Description: "請確認您的帳號是否正確",
      };

    case "auth/wrong-password":
      return {
        title: "密碼錯誤",
        Description: "請確認您的密碼是否正確",
      };

    default:
      return {
        title: "發生錯誤",
        Description: "請稍後再試",
      };
  }
};
