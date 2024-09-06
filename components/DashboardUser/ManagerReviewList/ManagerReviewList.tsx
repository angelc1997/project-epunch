"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { app } from "@/lib/firebase";
import { SquareCheck, SquareX } from "lucide-react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const db = getFirestore(app);

interface ManagerInfo {
  userId: string;
}

interface FormRecord {
  id: string;
  leaveType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  applicantName: string;
  applicantId: string;
  status: string;
  userId: string;
}

const ManagerReviewList = ({ userId }: ManagerInfo) => {
  const [formRecords, setFormRecords] = useState<FormRecord[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("pending");
  const [adminId, setAdminId] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const checkPermissionAndFetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) {
          console.error("找不到使用者");
          setHasPermission(false);
          return;
        }

        const userData = userDoc.data();
        const adminId = userData.adminId;
        setAdminId(adminId);

        const managerDoc = await getDoc(
          doc(db, "admins", adminId, "managers", userId)
        );

        if (!managerDoc.exists()) {
          console.error("找不到主管");
          setHasPermission(false);
          return;
        }

        setHasPermission(true);
        fetchManagerForms(adminId, currentStatus);
      } catch (error) {
        console.error("獲取權限失敗:", error);
        setHasPermission(false);
      }
    };

    checkPermissionAndFetchData();
  }, [userId, currentStatus]);

  const fetchManagerForms = async (adminId: string, status: string) => {
    try {
      const formRecordsRef = collection(
        db,
        "admins",
        adminId,
        "managers",
        userId,
        "reviewForms"
      );
      const q = query(formRecordsRef, where("status", "==", status));
      const querySnapshot = await getDocs(q);

      const records: FormRecord[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          id: doc.id,
          leaveType: data.leaveType,
          startDate: data.startDate,
          startTime: data.startTime,
          endDate: data.endDate,
          endTime: data.endTime,
          applicantName: data.name,
          applicantId: data.employeeId,
          status: data.status,
          userId: data.userId,
        });
      });

      setFormRecords(records);
      setTotalPages(Math.ceil(records.length / recordsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error("獲取表單資料失敗:", error);
    }
  };

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentPageRecords = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return formRecords.slice(startIndex, endIndex);
  };

  if (!hasPermission) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4 md:gap-6">
          <Card className="md:col-span-4">
            <CardHeader className="block text-center md:flex md:flex-row md:items-center md:justify-between md:text-left">
              <div className="gap-2">
                <CardTitle>員工假單審核</CardTitle>
                <CardDescription className="mt-2">
                  審核員工的各類假別申請。
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              無權限查看此頁面，如有問題，請聯繫管理員。
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const getLeaveTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      personal: "事假",
      sick: "病假",
      special: "特休",
      public: "公出",
      punch: "補打卡",
    };
    return types[type] || type;
  };

  const handleApproveReject = async (
    record: FormRecord,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const batch = writeBatch(db);

      const managerFormRef = doc(
        db,
        "admins",
        adminId,
        "managers",
        userId,
        "reviewForms",
        record.id
      );
      batch.update(managerFormRef, { status: newStatus });

      const employeeFormRef = doc(
        db,
        "users",
        record.userId,
        "formRecords",
        record.id
      );
      batch.update(employeeFormRef, { status: newStatus });

      await batch.commit();

      setFormRecords((prevRecords) =>
        prevRecords.filter((r) => r.id !== record.id)
      );

      toast({
        title: newStatus === "approved" ? "已批准" : "已拒絕",
        description: `${record.applicantName} 的請假申請已${
          newStatus === "approved" ? "批准" : "拒絕"
        }。`,
      });
      fetchManagerForms(adminId, currentStatus);
    } catch (error) {
      console.error("更新請假發生錯誤:", error);
      toast({
        title: "更新失敗",
        description: "更新請假發生錯誤，請稍後再試。",
        variant: "destructive",
      });
    }
  };

  const statusButtonChange = (record: FormRecord) => {
    switch (record.status) {
      case "approved":
        return <Badge variant="default">已通過</Badge>;
      case "rejected":
        return <Badge variant="destructive">已拒絕</Badge>;
      default:
        return (
          <div className="flex justify-center gap-1">
            <Button
              variant="outline"
              onClick={() => handleApproveReject(record, "approved")}
            >
              <SquareCheck className="text-green-500" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleApproveReject(record, "rejected")}
            >
              <SquareX className="text-red-500" />
            </Button>
          </div>
        );
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 md:gap-6">
        <Card className="md:col-span-4">
          <CardHeader className="block text-center md:flex md:flex-row md:items-center md:justify-between md:text-left">
            <div className="gap-2">
              <CardTitle>員工假單審核</CardTitle>
              <CardDescription className="mt-2">
                審核員工的各類假別申請。
              </CardDescription>
            </div>
            <div className="flex justify-end">
              <Select
                onValueChange={(value) => handlePageChange(Number(value))}
                value={currentPage.toString()}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="選擇頁數" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      第 {i + 1} 頁
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <div className="flex flex-row items-center justify-center gap-4 mb-4">
            <Button
              variant={currentStatus === "pending" ? "default" : "secondary"}
              onClick={() => handleStatusChange("pending")}
            >
              待審核
            </Button>
            <Button
              variant={currentStatus === "approved" ? "default" : "secondary"}
              onClick={() => handleStatusChange("approved")}
            >
              已通過
            </Button>
            <Button
              variant={currentStatus === "rejected" ? "default" : "secondary"}
              onClick={() => handleStatusChange("rejected")}
            >
              已拒絕
            </Button>
          </div>
          <CardContent className="text-center mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">申請人</TableHead>
                  <TableHead className="text-center">類型</TableHead>
                  <TableHead className="text-center">開始日期</TableHead>
                  <TableHead className="text-center">開始時間</TableHead>
                  <TableHead className="text-center">結束日期</TableHead>
                  <TableHead className="text-center">結束時間</TableHead>
                  <TableHead className="text-center">審核</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentPageRecords().map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{`${record.applicantId}-${record.applicantName}`}</TableCell>
                    <TableCell>{getLeaveTypeLabel(record.leaveType)}</TableCell>
                    <TableCell>{record.startDate}</TableCell>
                    <TableCell>{record.startTime}</TableCell>
                    <TableCell>{record.endDate}</TableCell>
                    <TableCell>{record.endTime}</TableCell>
                    <TableCell>{statusButtonChange(record)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ManagerReviewList;
