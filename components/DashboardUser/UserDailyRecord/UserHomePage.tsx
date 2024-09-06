"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlarmClock, CalendarDays, ClockArrowDown, MapPin } from "lucide-react";
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const auth = getAuth(app);
const db = getFirestore(app);

interface CompanyLocation {
  latitude: number;
  longitude: number;
  range: number;
  location: boolean;
}

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

const UserHomePage = () => {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [clockInTime, setClockInTime] = useState<string>("尚未打卡");
  const [clockOutTime, setClockOutTime] = useState<string>("尚未打卡");
  const [isClockIn, setIsClockIn] = useState<boolean>(false);

  const [isLocationRequired, setIsLocationRequired] = useState<boolean>(false);
  const [companyLocation, setCompanyLocation] = useState<CompanyLocation>({
    latitude: 0,
    longitude: 0,
    range: 0,
    location: false,
  });
  const [isLocationAllowed, setIsLocationAllowed] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] =
    useState<string>("正在檢查位置...");

  const { toast } = useToast();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString("zh-TW"));
      setCurrentTime(now.toLocaleTimeString("zh-TW"));
    };

    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    fetchCompanyLocation();
    fetchLatestClockRecord();
  }, []);

  useEffect(() => {
    if (companyLocation.location) {
      setIsLocationRequired(true);
      checkLocation();
    } else {
      setIsLocationRequired(false);
      setLocationStatus("無需使用定位打卡");
      setIsLocationAllowed(true);
    }
  }, [companyLocation]);

  const fetchCompanyLocation = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const { adminId } = userDoc.data();
        const adminDoc = await getDoc(doc(db, "admins", adminId));
        if (adminDoc.exists()) {
          const { latitude, longitude, range, location } = adminDoc.data();
          setCompanyLocation({ latitude, longitude, range, location });
        }
      }
    } catch (error) {
      console.error("獲取位置失敗:", error);
    }
  };

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("瀏覽器不支持地理位置");
      setIsLocationAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const distance = calculateDistance(
          userLat,
          userLng,
          companyLocation.latitude,
          companyLocation.longitude
        );
        const isAllowed = distance <= companyLocation.range;
        setLocationStatus(isAllowed ? "允許打卡範圍" : "不在允許範圍內");
        setIsLocationAllowed(isAllowed);
      },
      () => {
        setLocationStatus("未開啟位置定位");
        setIsLocationAllowed(false);
      }
    );
  };

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

  const fetchLatestClockRecord = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    try {
      // Check today's records
      const todayRecordRef = doc(db, `users/${user.uid}/clockRecords`, today);
      const todayRecordSnap = await getDoc(todayRecordRef);

      if (todayRecordSnap.exists()) {
        const data = todayRecordSnap.data() as DailyRecord;
        const lastRecord = data.records[data.records.length - 1];
        setClockInTime(lastRecord.clockIn || "尚未打卡");
        setClockOutTime(lastRecord.clockOut || "尚未打卡");
        setIsClockIn(!lastRecord.clockOut);
      } else {
        // If no records for today, check yesterday's records
        const yesterdayRecordRef = doc(
          db,
          `users/${user.uid}/clockRecords`,
          yesterday
        );
        const yesterdayRecordSnap = await getDoc(yesterdayRecordRef);

        if (yesterdayRecordSnap.exists()) {
          const data = yesterdayRecordSnap.data() as DailyRecord;
          const lastRecord = data.records[data.records.length - 1];
          if (lastRecord && !lastRecord.clockOut) {
            // There's an open clock-in from yesterday
            setClockInTime(lastRecord.clockIn);
            setClockOutTime("尚未打卡");
            setIsClockIn(true);
          } else {
            resetClockState();
          }
        } else {
          resetClockState();
        }
      }
    } catch (error) {
      console.error("獲取打卡記錄失敗:", error);
      resetClockState();
    }
  };

  const resetClockState = () => {
    setClockInTime("尚未打卡");
    setClockOutTime("尚未打卡");
    setIsClockIn(false);
  };

  const handleClock = async (isClockIn: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString("zh-TW");

    try {
      if (isClockIn) {
        // Clock-in logic
        const newRecord: DailyRecord = {
          date: today,
          records: [
            {
              clockInDate: today,
              clockOutDate: "",
              clockIn: time,
              clockOut: "",
            },
          ],
        };
        await setDoc(
          doc(db, `users/${user.uid}/clockRecords`, today),
          newRecord
        );
      } else {
        // Clock-out logic
        const yesterday = new Date(now.getTime() - 86400000)
          .toISOString()
          .split("T")[0];
        const todayRecordRef = doc(db, `users/${user.uid}/clockRecords`, today);
        const yesterdayRecordRef = doc(
          db,
          `users/${user.uid}/clockRecords`,
          yesterday
        );

        const todayRecordSnap = await getDoc(todayRecordRef);
        const yesterdayRecordSnap = await getDoc(yesterdayRecordRef);

        if (todayRecordSnap.exists()) {
          // Update today's record
          const data = todayRecordSnap.data() as DailyRecord;
          const lastRecord = data.records[data.records.length - 1];
          if (!lastRecord.clockOut) {
            lastRecord.clockOut = time;
            lastRecord.clockOutDate = today;
            await setDoc(todayRecordRef, data);
          } else {
            // If all records are closed, create a new clock-out record
            data.records.push({
              clockInDate: "",
              clockOutDate: today,
              clockIn: "",
              clockOut: time,
            });
            await setDoc(todayRecordRef, data);
          }
        } else if (yesterdayRecordSnap.exists()) {
          // Update yesterday's record for cross-day clock-out
          const data = yesterdayRecordSnap.data() as DailyRecord;
          const lastRecord = data.records[data.records.length - 1];
          if (!lastRecord.clockOut) {
            lastRecord.clockOut = time;
            lastRecord.clockOutDate = today;
            await setDoc(yesterdayRecordRef, data);
          }
        }
      }

      // Update state
      await fetchLatestClockRecord();

      toast({
        title: isClockIn ? "上班打卡成功" : "下班打卡成功",
        description: `打卡：${today} ${time}`,
      });
    } catch (error) {
      console.error("打卡更新失敗:", error);
      toast({
        title: "打卡失敗",
        description: "發生錯誤，請稍後再試",
        variant: "destructive",
      });
    }
  };

  const handleClockIn = () => handleClock(true);
  const handleClockOut = () => handleClock(false);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
        <Card className="md:col-span-3 text-center">
          <CardHeader className="bg-muted/50 text-muted-foreground text-lg font-semibold">
            今日打卡紀錄
          </CardHeader>

          <div>
            <CardHeader className="flex flex-row items-center justify-center">
              <CardTitle className="flex items-center justify-center gap-2 text-muted-foreground text-lg font-semibold">
                <ClockArrowDown />
                上班時間：
                <div className="text-2xl font-medium text-black">
                  {clockInTime}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              <Button
                size="lg"
                onClick={handleClockIn}
                disabled={
                  (isLocationRequired && !isLocationAllowed) || isClockIn
                }
              >
                上班打卡
              </Button>
            </CardContent>
          </div>
        </Card>

        <Card className="md:col-span-3 text-center">
          <CardHeader className="bg-muted/50 text-muted-foreground text-lg font-semibold">
            今日打卡紀錄
          </CardHeader>

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
              <Button
                size="lg"
                onClick={handleClockOut}
                disabled={
                  (isLocationRequired && !isLocationAllowed) || !isClockIn
                }
              >
                下班打卡
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default UserHomePage;
