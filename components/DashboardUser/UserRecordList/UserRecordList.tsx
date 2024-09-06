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
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
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

interface ClockRecord {
  clockInDate: string;
  clockOutDate: string;
  clockIn: string;
  clockOut: string;
}

interface DailyRecord {
  date: string;
  records: ClockRecord[];
}

const recordsPerPage = 5;

const UserRecordsList = ({ userId }: UserInfo) => {
  const [recordData, setRecordData] = useState<DailyRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const recordsRef = collection(db, `users/${userId}/clockRecords`);
    const q = query(recordsRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recordsData: DailyRecord[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DailyRecord;
        // Sort records within each day from newest to oldest
        const sortedRecords = data.records.sort((a, b) => {
          const timeA = a.clockIn || a.clockOut || "";
          const timeB = b.clockIn || b.clockOut || "";
          return timeB.localeCompare(timeA);
        });
        return {
          date: doc.id,
          records: sortedRecords,
        };
      });
      setRecordData(recordsData);
      const totalRecords = recordsData.reduce(
        (acc, curr) => acc + curr.records.length,
        0
      );
      setTotalPages(Math.ceil(totalRecords / recordsPerPage));
    });

    return () => unsubscribe();
  }, [userId]);

  const getStatus = (record: ClockRecord) => {
    if (!record.clockIn || !record.clockOut) {
      return <Badge variant="default">異常</Badge>;
    } else {
      return <Badge variant="secondary">正常</Badge>;
    }
  };

  const getPaginatedRecords = () => {
    const allRecords = recordData.flatMap((dailyRecord) =>
      dailyRecord.records.map((record) => ({
        ...record,
        date: dailyRecord.date,
      }))
    );
    const startIndex = (currentPage - 1) * recordsPerPage;
    return allRecords.slice(startIndex, startIndex + recordsPerPage);
  };

  const handlePageChange = (value: string) => {
    setCurrentPage(Number(value));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 grid-cols-1 md:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="block text-center md:flex md:flex-row md:items-center md:justify-between md:text-left">
            <div className="gap-2">
              <CardTitle>每日打卡紀錄</CardTitle>
              <CardDescription className="mt-2">
                僅紀錄每日上下班日期以及時間，無法進行任何更改。
              </CardDescription>
            </div>

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
          </CardHeader>
          <CardContent className="text-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">上班日期</TableHead>
                  <TableHead className="text-center">上班時間</TableHead>
                  <TableHead className="text-center">下班日期</TableHead>
                  <TableHead className="text-center">下班時間</TableHead>
                  <TableHead className="text-center hidden md:table-cell">
                    狀態
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getPaginatedRecords().map((record, index) => (
                  <TableRow key={`${record.clockInDate}-${index}`}>
                    <TableCell>{record.clockInDate}</TableCell>
                    <TableCell>{record.clockIn || "未打卡"}</TableCell>
                    <TableCell>{record.clockOutDate || "未打卡"}</TableCell>
                    <TableCell>{record.clockOut || "未打卡"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getStatus(record)}
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

export default UserRecordsList;
