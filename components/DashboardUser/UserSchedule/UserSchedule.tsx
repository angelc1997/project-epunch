"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Calendar } from "@/components/ui/calendar";
import { app } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore(app);

interface UserInfo {
  userId: string;
}

interface UserData {
  adminId: string;
  weeklySchedule: {
    [key: string]: string;
  };
}

interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isOff?: boolean;
}

const weekDays = ["日", "一", "二", "三", "四", "五", "六"] as const;
type WeekDay = (typeof weekDays)[number];

const UserSchedule: React.FC<UserInfo> = ({ userId }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [userData, setUserData] = useState<UserData | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as UserData;
          setUserData(userData);

          const schedulesRef = collection(
            db,
            "admins",
            userData.adminId,
            "schedules"
          );
          const schedulesSnap = await getDocs(schedulesRef);

          const schedulesData = schedulesSnap.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Schedule)
          );
          setSchedules(schedulesData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWeekDay = (date: Date | undefined): WeekDay => {
    if (!date) return "日";
    return weekDays[date.getDay()];
  };

  const getScheduleForDay = (day: WeekDay): Schedule | undefined => {
    if (!userData?.weeklySchedule) return undefined;
    const scheduleId = userData.weeklySchedule[day];
    if (scheduleId === "off") {
      return {
        id: "off",
        name: "休假",
        startTime: "",
        endTime: "",
        isOff: true,
      };
    }
    return schedules.find((s) => s.id === scheduleId);
  };

  const selectedDaySchedule = date
    ? getScheduleForDay(getWeekDay(date))
    : undefined;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="flex mx-auto"
            />
          </CardHeader>
        </Card>

        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-muted-foreground">
              排班時間
            </CardTitle>
            <CardDescription className="flex flex-row items-center justify-center gap-4">
              <div>{formatDate(date)}</div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={selectedDaySchedule?.isOff ? "outline" : "secondary"}
                >
                  {selectedDaySchedule?.name || "未設定"}
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>

          <ScrollArea>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">星期</TableHead>
                    <TableHead className="text-center">班別</TableHead>
                    <TableHead className="text-center">上班時間</TableHead>
                    <TableHead className="text-center">下班時間</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {weekDays.map((day) => {
                    const schedule = getScheduleForDay(day);
                    return (
                      <TableRow key={day}>
                        <TableCell className="text-center">{day}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={schedule?.isOff ? "outline" : "secondary"}
                          >
                            {schedule?.name || "未設定"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {schedule?.isOff
                            ? "休假"
                            : schedule
                            ? `${schedule.startTime}`
                            : "未設定"}
                        </TableCell>
                        <TableCell className="text-center">
                          {schedule?.isOff
                            ? "休假"
                            : schedule
                            ? `${schedule.endTime}`
                            : "未設定"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </main>
  );
};

export default UserSchedule;
