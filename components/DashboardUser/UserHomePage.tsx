"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlarmClock,
  CalendarDays,
  ClockArrowDown,
  ClockArrowUp,
  Hourglass,
  MapPin,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

// 假設的公司位置
const companyLocation = { lat: 24.9733426, lng: 121.4742528 };
// 允許距離
const allowedDistance = 100;
const workingEarlyStart = 8;
const workingLateStart = 10;
const minWorkingTime = 9;

const UserHomePage = () => {
  const [currentDate, setCurrentDate] = useState<string>(""); // 現在日期
  const [currentTime, setCurrentTime] = useState<string>(""); // 現在時間
  const [locationStatus, setLocationStatus] =
    useState<string>("正在檢查位置..."); // 目前位置的狀態
  const [isLocationAllowed, setIsLocationAllowed] = useState<boolean>(false); // 是否在允許範圍
  const [clockInTime, setClockInTime] = useState<string>("尚未打卡"); // 打卡上班時間
  const [clockOutTime, setClockOutTime] = useState<string>("尚未打卡"); // 打卡下班時間
  const [expectOutTime, setExpectOutTime] = useState<string>("尚未打卡"); // 預估下班時間
  const [isLate, setIsLate] = useState<boolean>(false); // 是否遲到
  const [isEarly, setIsEarly] = useState<boolean>(false); // 是否早退
  const [isOver, setIsOver] = useState<boolean>(false); // 是否加班
  const [isLeaveDay, setIsLeaveDay] = useState<boolean>(false); // 是否請假
  const [hasClockedIn, setHasClockedIn] = useState<boolean>(false); // 是否已經打卡上班
  const [hasClockedOut, setHasClockedOut] = useState<boolean>(false); // 是否已經打卡下班

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateString = now.toISOString().split("T")[0];
      const timeString = now.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentDate(dateString);
      setCurrentTime(timeString);
    };

    updateDateTime(); // 立即執行一次
    const timerId = setInterval(updateDateTime, 1000); // 每秒更新一次
    return () => clearInterval(timerId); // 清理函數
  }, []);

  useEffect(() => {
    const checkLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const distance = calculateDistance(
              userLat,
              userLng,
              companyLocation.lat,
              companyLocation.lng
            );
            console.log("距離：", userLat, userLng, distance);
            setLocationStatus(
              distance <= allowedDistance ? "允許打卡範圍" : "不在允許範圍內"
            );
            setIsLocationAllowed(distance <= allowedDistance);
          },
          (error) => {
            setLocationStatus("位置未開啟");
            setIsLocationAllowed(false);
          }
        );
      } else {
        setLocationStatus("瀏覽器不支持地理位置");
        setIsLocationAllowed(false);
      }
    };
    checkLocation();
  }, []);

  useEffect(() => {
    const fetchTodayRecord = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const dateString = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", user.uid, "records", dateString);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setClockInTime(data.clockInTime || "尚未打卡");
        setClockOutTime(data.clockOutTime || "尚未打卡");
        setExpectOutTime(data.expectOutTime || "尚未打卡");
        setIsLate(data.isLate || false);
        setIsEarly(data.isEarly || false);
        setIsOver(data.isOver || false);
        setHasClockedIn(!!data.clockInTime);
        setHasClockedOut(!!data.clockOutTime);
      }
    };

    fetchTodayRecord();
  }, []);

  // 計算兩點之間的距離
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateOutTime = (clockInTime: string): string => {
    const [inHours, inMinutes] = clockInTime.split(":").map(Number);

    if (inHours < workingEarlyStart) {
      return "17:00";
    } else if (inHours >= workingLateStart) {
      return "19:00";
    } else {
      const outTime = new Date();
      outTime.setHours(inHours + minWorkingTime, inMinutes, 0);
      return outTime.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  const handleClockIn = async () => {
    try {
      const now = new Date();
      const clockInTime = now.toLocaleTimeString("zh-TW", { hour12: false });
      const expectOutTime = calculateOutTime(clockInTime);
      const isLate = now.getHours() > workingLateStart;

      const user = auth.currentUser;
      if (!user) return;

      const dateString = now.toISOString().split("T")[0];
      await setDoc(doc(db, "users", user.uid, "records", dateString), {
        clockInTime,
        expectOutTime,
        isLate,
      });

      setClockInTime(clockInTime);
      setExpectOutTime(expectOutTime);
      setHasClockedIn(true);
    } catch (error) {
      console.error("上班打卡失敗:", error);
    }
  };

  const handleClockOut = async () => {
    try {
      if (!hasClockedIn) return;

      const now = new Date();
      const clockOutTime = now.toLocaleTimeString("zh-TW", { hour12: false });

      const clockOutMinutes = convertToMinutes(clockOutTime);
      const expectOutMinutes = convertToMinutes(expectOutTime);

      let isEarly = false;
      let isOver = false;

      if (clockOutMinutes < expectOutMinutes) {
        isEarly = true;
      } else if (clockOutMinutes > expectOutMinutes + 60) {
        isOver = true;
      }

      const user = auth.currentUser;
      if (!user) return;

      const dateString = now.toISOString().split("T")[0];
      await updateDoc(doc(db, "users", user.uid, "records", dateString), {
        clockOutTime,
        isEarly,
        isOver,
      });

      setClockOutTime(clockOutTime);
      setIsEarly(isEarly);
      setIsOver(isOver);
      setHasClockedOut(true);
    } catch (error) {
      console.error("下班打卡失敗:", error);
    }
  };

  const convertToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="absolute bottom-[-10%] right-[-5%] ">
              <div
                className="h-20 w-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundImage:
                    "radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)",
                }}
              >
                <CalendarDays className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-muted-foreground">
                今天日期
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{currentDate}</div>
            </CardContent>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="relative ">
            <div className="absolute bottom-[-10%] right-[-5%] ">
              <div
                className="h-20 w-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundImage:
                    "radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)",
                }}
              >
                <AlarmClock className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-muted-foreground">
                現在時間
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{currentTime}</div>
            </CardContent>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="relative">
            <div className="absolute bottom-[-10%] right-[-5%] ">
              <div
                className="h-20 w-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundImage:
                    "radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)",
                }}
              >
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-muted-foreground">
                目前位置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{locationStatus}</div>
            </CardContent>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
        <Card className="flex flex-col justify-center text-center">
          <div>
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                8:00 - 10:00
              </CardTitle>
              <CardDescription>表定上班時間</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={handleClockIn}
                disabled={!isLocationAllowed || hasClockedIn}
              >
                上班打卡
              </Button>
            </CardContent>
          </div>

          <div>
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                17:00 - 19:00
              </CardTitle>
              <CardDescription>表定下班時間</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={handleClockOut}
                disabled={!isLocationAllowed || !hasClockedIn || hasClockedOut}
              >
                下班打卡
              </Button>
            </CardContent>
          </div>
        </Card>

        <Card className="md:col-span-2 text-center">
          <CardHeader className="bg-muted/50 text-muted-foreground text-lg font-semibold">
            今日打卡紀錄
          </CardHeader>

          <div>
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle className="flex items-center justify-center gap-2 text-muted-foreground text-lg font-semibold">
                <ClockArrowUp />
                上班時間：
                <div className="text-2xl font-medium text-black">
                  {clockInTime}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              {isLate && <div>今日超出打卡時間，請記得補單。</div>}
            </CardContent>
          </div>
          <Separator />

          <div>
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle className="flex items-center justify-center gap-2 text-muted-foreground text-lg font-semibold">
                <Hourglass />
                預計下班時間：
                <div className="text-2xl font-medium text-black">
                  {expectOutTime}
                </div>
              </CardTitle>
            </CardHeader>
          </div>
          <Separator />

          <div>
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle className="flex items-center justify-center gap-2 text-muted-foreground text-lg font-semibold">
                <ClockArrowDown />
                下班時間：
                <div className="text-2xl font-medium text-black">
                  {clockOutTime}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              {isEarly && <div>您提早打卡下班，請記得補單</div>}
              {isOver && <div>您超過下班時間，請記得補單</div>}
            </CardContent>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default UserHomePage;
