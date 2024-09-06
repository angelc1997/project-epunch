import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Settings,
  SquareArrowOutUpRight,
  SquarePen,
  StepForward,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";

const TutorialCard = ({ adminId }: { adminId: string }) => {
  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <StepForward className="w-8 h-8 text-cyan-500 mr-2 flex-shrink-0" />
            <span className="text-cyan-500">新增員工帳號密碼</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap items-center gap-2 text-slate-700 text-base sm:text-lg">
            進入
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <Link
                href={`/admin/${adminId}/userlist`}
                className="flex items-center gap-2 justify-center"
              >
                <UserRoundPlus className="w-5 h-5" />
                <span>員工</span>
              </Link>
            </span>
            ，點選
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <span> + 新增員工</span>
            </span>
            填寫表單後確認送出，即可新增員工。新增增成功已建立員工的登入資料，登入時使用信箱及設定的密碼即可登入。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <StepForward className="w-8 h-8 text-cyan-500 mr-2 flex-shrink-0" />
            <span className="text-cyan-500">開啟定位打卡設置</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap items-center gap-2 text-slate-700 text-base sm:text-lg">
            進入
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <Link
                href={`/admin/${adminId}/adminsetting`}
                className="flex items-center gap-2 justify-center"
              >
                <Settings className="w-5 h-5" />
                <span>設定</span>
              </Link>
            </span>
            ，開啟
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <span>啟用定位</span>
            </span>
            設置經緯度位置，以及允許誤差的距離(單位為公里)，填寫完畢後按下儲存設定即完成設定。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <StepForward className="w-8 h-8 text-cyan-500 mr-2 flex-shrink-0" />
            <span className="text-cyan-500">如何取得座標經緯度</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap items-center gap-2 text-slate-700 text-base sm:text-lg">
            Step1：進入
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <Link
                href={`https://www.google.com/maps`}
                className="flex items-center gap-2 justify-center"
                target="_blank"
              >
                <span>Google地圖</span>
                <SquareArrowOutUpRight className="w-5 h-5" />
              </Link>
            </span>
          </p>
          <p className="flex flex-wrap items-center gap-2 text-slate-700 text-base sm:text-lg">
            Step2：在地圖上對需要座標的地點/區域按一下滑鼠右鍵，即可確認該地點的經緯度。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <StepForward className="w-8 h-8 text-cyan-500 mr-2 flex-shrink-0" />
            <span className="text-cyan-500">設定排班</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-wrap items-center gap-2 text-slate-700 text-base sm:text-lg">
            進入
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <Link
                href={`/admin/${adminId}/schedule`}
                className="flex items-center gap-2 justify-center"
              >
                <Clock className="w-5 h-5" />
                <span>排班</span>
              </Link>
            </span>
            ，先新增
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <span>排班設定</span>
            </span>
            ，然後點選員工列表中的
            <span className="bg-cyan-50 px-2 py-1 rounded hover:text-white hover:bg-cyan-500 transition-colors">
              <span className="flex items-center gap-2 justify-center">
                <SquarePen className="w-5 h-5" />
                編輯按鈕
              </span>
            </span>
            完成每日上下班時間安排。
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialCard;
