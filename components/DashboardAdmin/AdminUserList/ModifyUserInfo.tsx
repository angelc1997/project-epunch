"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import { app } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { useToast } from "../../ui/use-toast";
import { getErrorToast } from "@/lib/firebaseErrorHandler";

const db = getFirestore(app);
const auth = getAuth(app);

const statusOptions = [
  { value: "active", label: "在職" },
  { value: "inactive", label: "離職" },
  { value: "suspended", label: "留職中" },
];

const roleOptions = [
  { value: "manager", label: "主管" },
  { value: "staff", label: "員工" },
];

interface ModifyUserInfoProps {
  adminId: string;
  userId: string;
}

const ModifyUserInfo = ({ adminId, userId }: ModifyUserInfoProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({
    employeeId: "",
    name: "",
    department: "",
    position: "",
    tele: "",
    status: "",
    role: "",
  });
  const [originalRole, setOriginalRole] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      if (!isOpen) return;

      try {
        const userDoc = await getDoc(
          doc(db, "admins", adminId, "allUsers", userId)
        );
        if (userDoc.exists()) {
          const data = userDoc.data() as typeof userData;
          setUserData(data);
          setOriginalRole(data.role);
        }
      } catch (error) {
        const errorToast = getErrorToast(error);
        toast({
          title: errorToast.title,
          description: errorToast.description,
          variant: "destructive",
        });
      }
    };

    getUserData();
  }, [adminId, userId, toast, isOpen]);

  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updateUserData = {
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      // 更新admins底下的allUsers
      await updateDoc(
        doc(db, "admins", adminId, "allUsers", userId),
        updateUserData
      );

      // 更新users底下
      await updateDoc(doc(db, "users", userId), updateUserData);

      // 處理manager角色的變更
      if (userData.role !== originalRole) {
        if (userData.role === "manager") {
          await setDoc(
            doc(db, "admins", adminId, "managers", userId),
            updateUserData
          );
        } else {
          await deleteDoc(doc(db, "admins", adminId, "managers", userId));
        }
      } else if (userData.role === "manager") {
        // 如果角色沒變，但原本就是manager，更新managers集合
        await updateDoc(
          doc(db, "admins", adminId, "managers", userId),
          updateUserData
        );
      }

      toast({
        title: "員工資料更新成功",
        description: "已更新員工資料",
      });

      setIsOpen(false);
    } catch (error) {
      const errorToast = getErrorToast(error);
      toast({
        title: errorToast.title,
        description: errorToast.description,
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SquarePen className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯員工資料</DialogTitle>
          <DialogDescription>請輸入您要編輯的員工資料欄位</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div>
            <Label>員編</Label>
            <Input
              name="employeeId"
              className="mt-2"
              value={userData.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
            />
          </div>
          <div>
            <Label>姓名</Label>
            <Input
              name="name"
              className="mt-2"
              value={userData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>部門</Label>
          <Input
            name="department"
            className="mt-2"
            value={userData.department}
            onChange={(e) => handleChange("department", e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div>
            <Label>職位</Label>
            <Input
              name="position"
              className="mt-2"
              value={userData.position}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </div>

          <div>
            <Label>分機</Label>
            <Input
              className="mt-2"
              name="tele"
              value={userData.tele}
              onChange={(e) => handleChange("tele", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-full">
            <Label>狀態</Label>
            <div className="mt-2">
              <Select
                value={userData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="狀態" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full">
            <Label>權限</Label>
            <div className="mt-2">
              <Select
                value={userData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="權限" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>確定修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyUserInfo;
