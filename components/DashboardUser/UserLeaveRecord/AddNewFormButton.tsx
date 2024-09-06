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
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

const statusOptions = [
  { value: "personal", label: "事假" },
  { value: "sick", label: "病假" },
  { value: "special", label: "特休" },
  { value: "public", label: "公出" },
  { value: "punch", label: "補打卡" },
];

interface ManagerData {
  email: string;
  name: string;
  userId: string;
  department: string;
}

interface UserData {
  employeeId: string;
  name: string;
  adminId: string;
}

interface LeaveFormData {
  userId: string;
  employeeId: string;
  name: string;
  leaveType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  duration: string;
  reviewer: string;
  reviewerId: string;
  isReviewed: boolean;
  status: string;
  createdAt: Date | null;
}

const AddNewFormButton: React.FC<{ userId: string }> = ({ userId }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [managersData, setManagersData] = useState<ManagerData[]>([]);
  const [formData, setFormData] = useState<LeaveFormData>({
    userId: "",
    employeeId: "",
    name: "",
    leaveType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    duration: "",
    reviewer: "",
    reviewerId: "",
    isReviewed: false,
    status: "pending",
    createdAt: null,
  });

  useEffect(() => {
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserData;
        setUserData(data);
        setFormData((prevData) => ({
          ...prevData,
          userId,
          employeeId: data.employeeId,
          name: data.name,
        }));
      } else {
        toast({
          title: "錯誤",
          description: "無法取得使用者資料",
        });
      }
    });

    return () => unsubscribe();
  }, [userId, toast]);

  useEffect(() => {
    if (userData?.adminId) {
      const managersRef = collection(
        db,
        "admins",
        userData.adminId,
        "managers"
      );
      const unsubscribe = onSnapshot(managersRef, (snapshot) => {
        const managers = snapshot.docs.map((doc) => ({
          email: doc.data().email,
          name: doc.data().name,
          department: doc.data().department,
          userId: doc.id,
        }));
        setManagersData(managers);
      });

      return () => unsubscribe();
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewerChange = (value: string) => {
    const selectedManager = managersData.find(
      (manager) => manager.userId === value
    );
    if (selectedManager) {
      setFormData((prev) => ({
        ...prev,
        reviewer: selectedManager.name,
        reviewerId: selectedManager.userId,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!userData?.adminId) {
      toast({
        title: "錯誤",
        description: "無法取得管理者",
        variant: "destructive",
      });
      return;
    }

    if (!formData.reviewerId) {
      toast({
        title: "錯誤",
        description: "請選擇審核人",
        variant: "destructive",
      });
      return;
    }

    try {
      const batch = writeBatch(db);
      const leaveDateData = {
        ...formData,
        createdAt: serverTimestamp(),
      };

      const formId = `${formData.startDate}-${Date.now()}`;

      // 寫入使用者record
      const userRecordRef = doc(db, "users", userId, "formRecords", formId);
      batch.set(userRecordRef, leaveDateData);

      // 寫入審核人record
      const reviewerRecordRef = doc(
        db,
        "admins",
        userData.adminId,
        "managers",
        formData.reviewerId,
        "reviewForms",
        formId
      );
      batch.set(reviewerRecordRef, leaveDateData);

      await batch.commit();

      toast({
        title: "表單已提交",
        description: "您的請假申請已成功提交，等待審核中。",
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "提交失敗",
        description: `提交表單時發生錯誤：${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新增假單
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增請假表單</DialogTitle>
          <DialogDescription>
            請填寫所有欄位並送出表單後等待審核
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <div>
            <Label htmlFor="employeeId">員編</Label>
            <Input
              id="employeeId"
              name="employeeId"
              className="mt-2"
              value={formData.employeeId}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              className="mt-2"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="leaveType">請假類型</Label>
            <Select
              onValueChange={(value) => handleSelectChange("leaveType", value)}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="選擇請假類型" />
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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="startDate">開始日期</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              className="mt-2"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="startTime">開始時間</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              className="mt-2"
              value={formData.startTime}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="endDate">結束日期</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              className="mt-2"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="endTime">結束時間</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              className="mt-2"
              value={formData.endTime}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-full">
            <Label htmlFor="reviewer">審核人</Label>
            <Select onValueChange={handleReviewerChange}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="選擇主管" />
              </SelectTrigger>
              <SelectContent>
                {managersData.map((manager) => (
                  <SelectItem key={manager.userId} value={manager.userId}>
                    {manager.department} - {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>提交表單</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewFormButton;
