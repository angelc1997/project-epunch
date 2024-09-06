import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Menu,
  NotepadText,
  CalendarClock,
  AlarmClockPlus,
  CalendarX2,
  CircleCheckBig,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type UserInfo = {
  userId: string;
};
const UserMobileNav = ({ userId }: UserInfo) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="w-6 h-6 text-slate-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center justify-center py-4 px-4 gap-2 text-lg font-bold"
          >
            <span className="flex items-center gap-2">
              <Image
                src="/assets/LOGO.png"
                alt="ePunch-logo"
                width={30}
                height={30}
              />
              ePunch點點班
            </span>
          </Link>

          <Link
            href={`/user/${userId}/dailyrecord`}
            className="flex items-center gap-2 justify-center hover:text-primary"
          >
            <AlarmClockPlus className="w-5 h-5" />
            <span>打卡</span>
          </Link>

          <Link
            href={`/user/${userId}/recordlist`}
            className="flex items-center gap-2 justify-center hover:text-primary"
          >
            <NotepadText className="w-5 h-5" />
            <span>紀錄</span>
          </Link>

          <Link
            href={`/user/${userId}/schedule`}
            className="flex items-center gap-2 justify-center hover:text-primary"
          >
            <CalendarClock className="w-5 h-5" />
            <span>排班</span>
          </Link>

          <Link
            href={`/user/${userId}/leaverecord`}
            className="flex items-center gap-2 justify-center hover:text-primary"
          >
            <CalendarX2 className="w-5 h-5" />
            <span>請假</span>
          </Link>

          {/* 需要判斷是否為主管 */}
          <Link
            href={`/user/${userId}/reviewlist`}
            className="flex items-center gap-2 justify-center hover:text-primary"
          >
            <CircleCheckBig className="w-5 h-5" />
            <span>審核</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default UserMobileNav;
