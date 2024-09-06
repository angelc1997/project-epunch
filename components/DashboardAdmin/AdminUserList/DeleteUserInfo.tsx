"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { app } from "@/lib/firebase";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const db = getFirestore(app);

interface DeleteInfoProps {
  adminId: string;
  userId: string;
}

const DeleteUserInfo = ({ adminId, userId }: DeleteInfoProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const deleteUser = async () => {
    try {
      await deleteDoc(doc(db, "admins", adminId, "allUsers", userId));
      await deleteDoc(doc(db, "admins", adminId, "managers", userId));
      await deleteDoc(doc(db, "users", userId));

      toast({
        title: "員工刪除成功",
        description: "已刪除該員工的資料。",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("刪除用戶時發生錯誤:", error);
      toast({
        title: "刪除失敗",
        description: "刪除員工資料時發生錯誤，請稍後再試。",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="w-5 h-5 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確認刪除員工?</AlertDialogTitle>
          <AlertDialogDescription>
            此操作將永久刪除該員工的資料，無法復原。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={deleteUser}>刪除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserInfo;
