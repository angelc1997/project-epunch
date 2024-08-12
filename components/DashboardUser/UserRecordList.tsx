"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
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

const UserRecordsList = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

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
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>每日打卡紀錄</CardTitle>
              <CardDescription>
                如有異常之紀錄，請點選『申請處理』進行填寫、審核。
              </CardDescription>
            </div>
            <Button asChild size="default" className="ml-auto gap-1">
              <Link href="#">
                <Plus className="h-5 w-5" />
                新增假單
              </Link>
            </Button>
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
                <TableRow>
                  <TableCell>2023-06-23</TableCell>
                  <TableCell className="hidden md:table-cell">
                    10:42:29
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    19:20:29
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">遲到</Badge>
                    <Badge variant="destructive">早退</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary">申請處理</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UserRecordsList;
