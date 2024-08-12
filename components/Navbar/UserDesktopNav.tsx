import Link from "next/link";
import { House, NotepadText, SquareMousePointer } from "lucide-react";

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
        <SquareMousePointer className="h-6 w-6" />
        <span>ePunch點點班</span>
      </Link>

      <Link
        href={`/user/${userId}/dailyrecord`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <House className="w-5 h-5" />
        <span>打卡</span>
      </Link>

      <Link
        href={`/user/${userId}/recordlist`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <NotepadText className="w-5 h-5" />
        <span>紀錄</span>
      </Link>
    </nav>
  );
};

export default UserDesktopNav;
