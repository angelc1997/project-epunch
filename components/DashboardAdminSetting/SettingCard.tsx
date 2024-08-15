import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@radix-ui/react-switch";
import { Button } from "@/components/ui/button";

type AdminInfo = {
  adminId: string;
  name: string;
  email: string;
};

const SettingCard = ({ adminId, name, email }: AdminInfo) => {
  return (
    <div className="relative mt-10 grid grid-cols-3 gap-6">
      {/* 修改管理員資料 */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>管理員資訊設定</CardTitle>
          <CardDescription>
            可進行管理員姓名以及信箱修改，如未修改保持為原始資料
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label>管理員姓名</Label>
            <Input value={name} />
            <Label>管理員信箱</Label>
            <Input value={email} />
          </form>
        </CardContent>
      </Card>

      {/* 修改上下班打卡相關設定 */}
      <Card>
        <CardHeader>
          <CardTitle>打卡相關設定</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label>最早上班時間</Label>
            <Input />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>打卡相關設定</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label>最晚上班時間</Label>
            <Input />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>打卡相關設定</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label>總工作時數</Label>
            <Input />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>打卡相關設定</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Label>定位設定</Label>
            <Switch id="location-mode"></Switch>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingCard;
