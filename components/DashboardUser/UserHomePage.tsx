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

// 假設的公司位置
const companyLocation = { lat: 25.033, lng: 121.5654 };
// 允許距離
const allowedDistance = 100;

const UserHomePage = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [locationStatus, setLocationStatus] = useState("正在檢查位置...");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // 設置日期
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      setCurrentDate(`${year}-${month}-${day}`);

      // 設置時間
      setCurrentTime(
        now.toLocaleTimeString("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
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

            if (distance <= allowedDistance) {
              setLocationStatus("允許範圍");
            } else {
              setLocationStatus("不在允許範圍內");
            }
          },
          (error) => {
            setLocationStatus("位置未開啟");
          }
        );
      } else {
        setLocationStatus("瀏覽器不支持地理位置");
      }
    };

    checkLocation();
  }, []);

  // 計算兩點之間的距離
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // 地球半徑（米）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 返回距離（米）
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
              <Button size="lg">上班打卡</Button>
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
              <Button size="lg">下班打卡</Button>
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
                <div className="text-2xl font-medium text-black">10:42:29</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              今日超出打卡時間，請記得補單。
            </CardContent>
          </div>
          <Separator />

          <div>
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle className="flex items-center justify-center gap-2 text-muted-foreground text-lg font-semibold">
                <Hourglass />
                預計下班時間：
                <div className="text-2xl font-medium text-black">19:00</div>
              </CardTitle>
            </CardHeader>
          </div>
          <Separator />

          <div>
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle className="flex items-center justify-center gap-2 text-muted-foreground text-lg font-semibold">
                <ClockArrowDown />
                下班時間：
                <div className="text-2xl font-medium text-black">20:42:29</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              今日超出打卡時間，請記得補單。
            </CardContent>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default UserHomePage;
