"use client";
import React, { useState } from "react";
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
import { app, secondApp } from "@/lib/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getErrorToast } from "@/lib/firebaseErrorHandler";

const auth = getAuth(app);
const auth2 = getAuth(secondApp);
const db = getFirestore(app);

const statusOptions = [
  { value: "active", label: "在職" },
  { value: "inactive", label: "離職" },
  { value: "suspended", label: "留職中" },
];

const roleOptions = [
  { value: "manager", label: "主管" },
  { value: "staff", label: "員工" },
];

interface Admin {
  adminId: string;
}

const AddNewUserButton = ({ adminId }: Admin) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    employeeId: "",
    name: "",
    department: "",
    position: "",
    email: "",
    password: "",
    tele: "",
    status: "",
    role: "",
  });

  const handleChange = (field: string, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(newUser).some((value) => !value)) {
      toast({
        title: "新增失敗",
        description: "請確認所有欄位皆已填寫",
        variant: "destructive",
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth2,
        newUser.email,
        newUser.password
      );
      const user = auth2.currentUser;

      if (!user) {
        throw new Error("找不到使用者");
      }

      await updateProfile(user, {
        displayName: newUser.name,
      });

      const userData = {
        userId: user.uid,
        ...newUser,
        createdAt: new Date().toISOString(),
        sys: "user",
      };

      await setDoc(doc(db, "users", user.uid), userData);
      await setDoc(doc(db, "admins", adminId, "allUsers", user.uid), userData);
      if (newUser.role === "manager") {
        await setDoc(
          doc(db, "admins", adminId, "managers", user.uid),
          userData
        );
      }

      toast({
        title: "新增成功",
        description: `新增${newUser.name}資料成功`,
      });

      setIsOpen(false);
      setNewUser({
        employeeId: "",
        name: "",
        department: "",
        position: "",
        email: "",
        password: "",
        tele: "",
        status: "",
        role: "",
      });
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
        <Button onClick={() => setIsOpen(true)}>新增員工</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增員工表單</DialogTitle>
          <DialogDescription>請輸入您要新增的員工資料</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div>
            <Label>員編</Label>
            <Input
              name="employeeId"
              className="mt-2"
              placeholder="ex:A001"
              value={newUser.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
            />
          </div>
          <div>
            <Label>姓名</Label>
            <Input
              name="name"
              className="mt-2"
              placeholder="ex:王小明"
              value={newUser.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div>
            <Label>部門</Label>
            <Input
              name="department"
              className="mt-2"
              placeholder="ex:人力資源處"
              value={newUser.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
          </div>
          <div>
            <Label>職位</Label>
            <Input
              name="position"
              className="mt-2"
              placeholder="ex:工程師"
              value={newUser.position}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>信箱</Label>
          <Input
            name="email"
            className="mt-2"
            placeholder="ex: employee@example.com"
            value={newUser.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <Label>密碼</Label>
          <Input
            name="password"
            type="password"
            className="mt-2"
            autoComplete="new-password"
            placeholder="如:123456"
            value={newUser.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <div>
          <Label>分機</Label>
          <Input
            className="mt-2"
            placeholder="分機"
            name="tele"
            value={newUser.tele}
            onChange={(e) => handleChange("tele", e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="w-full">
            <Label>狀態</Label>
            <div className="mt-2">
              <Select
                value={newUser.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="狀態" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
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
                value={newUser.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="權限" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
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
          <Button onClick={handleSubmit}>確認新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewUserButton;
