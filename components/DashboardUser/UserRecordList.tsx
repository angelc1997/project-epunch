"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Calendar } from "@/components/ui/calendar";
import { app } from "@/lib/firebase";

import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import AddNewFormButton from "./AddNewFormButton";

const db = getFirestore(app);

type UserInfo = {
  userId: string;
};

interface Record {
  id: string;
  clockInTime: string;
  clockOutTime: string;
  isEarly?: boolean;
  isLate?: boolean;
  isOver?: boolean;
}

const UserRecordsList = ({ userId }: UserInfo) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [recordData, setRecordData] = useState<Record[]>([]);

  useEffect(() => {
    const recordsRef = collection(db, `users/${userId}/records`);
    const q = query(recordsRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recordsData: Record[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          clockInTime: data.clockInTime,
          clockOutTime: data.clockOutTime,
          isEarly: data.isEarly,
          isLate: data.isLate,
          isOver: data.isOver,
        };
      });
      const sortedRecordsData = recordsData.sort((a, b) =>
        b.id.localeCompare(a.id)
      );
      setRecordData(sortedRecordsData);
      console.log("recordsData", recordsData);
    });

    return () => unsubscribe();
  }, [userId]);

  const getStatus = (record: Record): string[] => {
    const statuses: string[] = [];
    if (record.isLate) statuses.push("遲到");
    if (record.isEarly) statuses.push("早退");
    if (record.isOver) statuses.push("加班");
    return statuses;
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 grid-cols-1 first-letter:md:gap-6">
        <Card className="flex flex-col md:flex-row">
          <CardHeader>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="flex mx-auto"
            />
          </CardHeader>
          <CardContent>李王</CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="block text-center md:flex md:flex-row md:items-center md:justify-between md:text-left">
            <div className="gap-2">
              <CardTitle>每日打卡紀錄</CardTitle>
              <CardDescription className="mt-2">
                如有異常之紀錄，請點選『申請處理』進行填寫、審核。
              </CardDescription>
            </div>
            <div className="">
              <AddNewFormButton userId={userId} />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">日期</TableHead>
                  <TableHead className="text-center hidden md:table-cell ">
                    上班時間
                  </TableHead>
                  <TableHead className="text-center hidden md:table-cell">
                    下班時間
                  </TableHead>
                  <TableHead className="text-center">狀態</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recordData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.clockInTime || "未打卡"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.clockOutTime || "未打卡"}
                    </TableCell>
                    <TableCell>
                      {getStatus(record).map((status, index) => {
                        if (status === "遲到" || status === "早退") {
                          return (
                            <Badge
                              key={index}
                              variant="destructive"
                              className="mr-1"
                            >
                              {status}
                            </Badge>
                          );
                        } else if (status === "加班") {
                          return (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="mr-1"
                            >
                              {status}
                            </Badge>
                          );
                        } else {
                          return (
                            <Badge
                              key={index}
                              variant="outline"
                              className="mr-1"
                            >
                              {status}
                            </Badge>
                          );
                        }
                      })}
                    </TableCell>
                    <TableCell>
                      {record.clockInTime ||
                      record.clockOutTime ||
                      record.isLate ||
                      record.isEarly ||
                      record.isOver ? (
                        <Button variant="secondary" size="sm">
                          申請處理 <ArrowUpRight className="h-5 w-5 m-2" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          無異常
                        </Button>
                      )}
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
