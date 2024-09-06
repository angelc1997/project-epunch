"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

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
import { app } from "@/lib/firebase";

import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import AddNewFormButton from "./AddNewFormButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const db = getFirestore(app);

type UserInfo = {
  userId: string;
};

interface LeaveRecord {
  id: string;
  leaveType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  reviewer: string;
  status: string;
  createdAt: Timestamp;
}

const recordsPerPage = 5;

const UserLeaveList = ({ userId }: UserInfo) => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const recordsRef = collection(db, `users/${userId}/formRecords`);
      const q = query(
        recordsRef,
        orderBy("createdAt", "desc"),
        limit(recordsPerPage)
      );

      // console.log("q", q);

      const querySnapshot = await getDocs(q);
      const recordsData: LeaveRecord[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt as Timestamp,
          } as LeaveRecord)
      );

      setLeaveRecords(recordsData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const totalCountSnapshot = await getDocs(
        collection(db, `users/${userId}/formRecords`)
      );
      setTotalPages(Math.ceil(totalCountSnapshot.size / recordsPerPage));
    };

    fetchRecords();
  }, [userId]);

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

  const handlePageChange = async (value: string) => {
    const selectedPage = Number(value);
    setCurrentPage(selectedPage);

    const recordsRef = collection(db, `users/${userId}/formRecords`);
    let q;

    if (selectedPage === 1) {
      q = query(
        recordsRef,
        orderBy("createdAt", "desc"),
        limit(recordsPerPage)
      );
    } else {
      q = query(
        recordsRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(recordsPerPage)
      );
    }

    const querySnapshot = await getDocs(q);
    const recordsData = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt as Timestamp,
        } as LeaveRecord)
    );
    setLeaveRecords(recordsData);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 md:gap-6">
        {/* <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-muted-foreground">
              事假
            </CardTitle>
            <CardDescription>3 / 小時 </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-medium">
              <Progress value={2} className="w-[100%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-muted-foreground">
              病假
            </CardTitle>
            <CardDescription>8.5 / 小時</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-medium">
              <Progress value={8} className="w-[100%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-muted-foreground">
              特休
            </CardTitle>
            <CardDescription>10 / 小時</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-medium">
              <Progress value={10} className="w-[100%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-muted-foreground">
              公出
            </CardTitle>
            <CardDescription>50 / 小時 </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-medium">
              <Progress value={50} className="w-[100%]" />
            </div>
          </CardContent>
        </Card> */}

        <Card className="md:col-span-4">
          <CardHeader className="block text-center md:flex md:flex-row md:items-center md:justify-between md:text-left">
            <div className="gap-2">
              <CardTitle>個人請假紀錄</CardTitle>
              <CardDescription className="mt-2">
                個人事假、病假、特休、公出、補打卡等類型假單申請。
              </CardDescription>
            </div>
            <div className="flex items-center justify-between gap-4">
              <AddNewFormButton userId={userId} />

              <div className="flex justify-end">
                <Select
                  onValueChange={handlePageChange}
                  value={currentPage.toString()}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="選擇頁數" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(totalPages)].map((_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        第 {i + 1} 頁
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">類型</TableHead>
                  <TableHead className="text-center">開始日期</TableHead>
                  <TableHead className="text-center hidden md:table-cell">
                    開始時間
                  </TableHead>
                  <TableHead className="text-center">結束日期</TableHead>
                  <TableHead className="text-center hidden md:table-cell">
                    結束時間
                  </TableHead>
                  <TableHead className="text-center hidden md:table-cell">
                    審核人
                  </TableHead>
                  <TableHead className="text-center">審核狀態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{getLeaveTypeLabel(record.leaveType)}</TableCell>
                    <TableCell>{record.startDate}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.startTime}
                    </TableCell>
                    <TableCell>{record.endDate}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.endTime}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.reviewer}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "pending"
                            ? "secondary"
                            : record.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {record.status === "pending"
                          ? "審核中"
                          : record.status === "approved"
                          ? "已通過"
                          : "已拒絕"}
                      </Badge>
                    </TableCell>
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

export default UserLeaveList;
