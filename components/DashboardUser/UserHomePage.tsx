import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Activity,
  AlarmClock,
  ArrowUpRight,
  CalendarDays,
  ClockArrowDown,
  ClockArrowUp,
  CreditCard,
  DollarSign,
  Hourglass,
  MapPin,
  Users,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const UserHomePage = () => {
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
              <div className="text-2xl font-medium">2024-08-09</div>
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
              <div className="text-2xl font-medium">上午3:02:00</div>
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
              <div className="text-2xl font-medium">無法取得位置</div>
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
