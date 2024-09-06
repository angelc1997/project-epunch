"use client";
import React, { useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { app } from "@/lib/firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

const db = getFirestore(app);
const auth = getAuth(app);

type AdminInfo = {
  adminId: string;
  name: string;
  email: string;
};

const SettingCard = ({ adminId, name, email }: AdminInfo) => {
  const [newName, setNewName] = useState(name);
  const [locationEnabled, setLocationEnabled] = useState(false); // 是否啟用定位
  const [latitude, setLatitude] = useState<number | null>(null); // 緯度
  const [longitude, setLongitude] = useState<number | null>(null); // 經度
  const [range, setRange] = useState<number | null>(null); // 可接受範圍
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminDoc = await getDoc(doc(db, "admins", adminId));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setNewName(data.companyName);
          setLocationEnabled(data.location);
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setRange(data.range);
        }
      } catch (error) {
        console.error("獲取管理員資料失敗:", error);
        toast({
          title: "資料讀取失敗",
          description: "無法獲取管理員資料，請稍後再試",
          variant: "destructive",
        });
      }
    };

    fetchAdminData();
  }, [adminId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminRef = doc(db, "admins", adminId);
    const adminData = {
      companyName: newName,
      location: locationEnabled,
      latitude: locationEnabled ? latitude : null,
      longitude: locationEnabled ? longitude : null,
      range: locationEnabled ? range : null,
    };

    try {
      const user = auth.currentUser;
      await updateDoc(adminRef, adminData);
      if (user) {
        await updateProfile(user, { displayName: newName });
      }
      toast({
        title: "更新成功",
        description: "管理員資訊已更新",
      });
    } catch (error) {
      console.error("更新失敗:", error);
      let errorMessage = "請稍後再試或聯繫支援";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "更新失敗",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-10 grid gap-6 grid-cols-1 md:grid-cols-4"
    >
      {/* 修改管理員資料 */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>管理員資訊</CardTitle>
          <CardDescription>可進行管理員姓名修改，信箱不可更改</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">管理員姓名</Label>
              <Input
                id="name"
                className="mt-2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="email">管理員信箱</Label>
                <p className="text-sm text-red-500">*無法進行修改</p>
              </div>
              <Input
                id="email"
                className="mt-2 bg-slate-100"
                value={email}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 定位設置 */}
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
          <div className="space-y-4">
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
                    value={latitude?.toString() ?? ""}
                    onChange={(e) =>
                      setLatitude(parseFloat(e.target.value) || null)
                    }
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
                    value={longitude?.toString() ?? ""}
                    onChange={(e) =>
                      setLongitude(parseFloat(e.target.value) || null)
                    }
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
                    value={range?.toString() ?? ""}
                    onChange={(e) =>
                      setRange(parseFloat(e.target.value) || null)
                    }
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 儲存按鈕 */}
      <div className="col-span-1 md:col-span-4">
        <Button type="submit" className="w-full">
          儲存設定
        </Button>
      </div>
    </form>
  );
};

export default SettingCard;
