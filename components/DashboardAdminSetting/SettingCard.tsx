import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type AdminInfo = {
  adminId: string;
  name: string;
  email: string;
};

const SettingCard = ({ adminId, name, email }: AdminInfo) => {
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <div className="relative mt-10 grid gap-6 grid-cols-1 md:grid-cols-4">
      {/* 修改管理員資料 */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>管理員資訊</CardTitle>
          <CardDescription>
            可進行管理員姓名以及信箱修改，如未修改保持為原始資料
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">管理員姓名</Label>
              <Input id="name" className="mt-2" value={name} />
            </div>
            <div>
              <Label htmlFor="email">管理員信箱</Label>
              <Input id="email" className="mt-2" value={email} />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>定位</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="location-mode">啟用定位</Label>
              <Switch
                id="location-mode"
                checked={locationEnabled}
                onCheckedChange={setLocationEnabled}
              />
            </div>
          </div>
          <CardDescription>提供設置打卡位置以及允許打卡範圍</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {locationEnabled && (
              <>
                <div>
                  <Label htmlFor="latitude">緯度</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    className="mt-2"
                    placeholder="輸入緯度"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">經度</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    className="mt-2"
                    placeholder="輸入經度"
                  />
                </div>
                <div>
                  <Label htmlFor="range">允許誤差距離</Label>
                  <Input
                    id="range"
                    type="number"
                    step="0.1"
                    className="mt-2"
                    placeholder="輸入範圍（公里）"
                  />
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 修改上下班打卡相關設定 */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>上班打卡</CardTitle>
          <CardDescription>提供設定最早上班時間</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label htmlFor="earliest-time">最早上班時間</Label>
            <Input id="earliest-time" type="time" className="mt-2" />
          </form>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>上班打卡</CardTitle>
          <CardDescription>提供設定最晚上班時間</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label htmlFor="latest-time">最晚上班時間</Label>
            <Input id="latest-time" type="time" className="mt-2" />
          </form>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>工作時數</CardTitle>
          <CardDescription>提供設定總工作時數</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label htmlFor="total-hours">總工作時數</Label>
            <Input id="total-hours" type="number" className="mt-2" />
          </form>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>下班打卡</CardTitle>
          <CardDescription>
            提供設定預計下班時間後的彈性打卡期間
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label htmlFor="flexible-hours">彈性打卡期間</Label>
            <Input id="flexible-hours" type="number" className="mt-2" />
          </form>
        </CardContent>
      </Card>

      <div className="col-span-1 md:col-span-4">
        <Button type="submit" className="w-full">
          儲存設定
        </Button>
      </div>
    </div>
  );
};

export default SettingCard;
