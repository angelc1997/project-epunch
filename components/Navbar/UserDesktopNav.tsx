import Link from "next/link";
import Image from "next/image";
import {
  AlarmClockPlus,
  CalendarClock,
  CalendarX2,
  CircleCheckBig,
  NotepadText,
} from "lucide-react";

type UserInfo = {
  userId: string;
};

const UserDesktopNav = ({ userId }: UserInfo) => {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-bold md:flex md:flex-row md:items-center">
      <Link
        href="/"
        className="flex items-center gap-2 justify-center hover:text-primary"
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
  );
};

export default UserDesktopNav;
