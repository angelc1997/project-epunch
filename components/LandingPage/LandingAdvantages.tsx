import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";
const LandingAdvantages = () => {
  return (
    <div className="mt-10 grid md:grid-flow-row lg:grid-flow-col lg:gird-cols-3 gap-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BadgeCheck className="w-10 h-10 text-cyan-500 mr-2" />
            一鍵<span className="text-cyan-500">打卡</span>，立即上班
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 text-lg">
            使用ePunch只需要使用手機、平板、電腦即可完成上下班打卡
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BadgeCheck className="w-10 h-10 text-cyan-500 mr-2" />
            <span className="text-cyan-500">電子</span>表單，審核方便
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 text-lg">
            使用電子表單快速便捷，隨時申請、審核不受地域限制
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BadgeCheck className="w-10 h-10 text-cyan-500 mr-2" />
            簡易管理，<span className="text-cyan-500">最佳</span>夥伴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 text-lg">
            ePunch提供直觀使用界面，輕鬆掌握並管理所有人員
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingAdvantages;
