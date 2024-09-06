import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  MessageCircleQuestion,
  NotebookText,
  Settings,
  UserRoundPlus,
} from "lucide-react";

type AdminInfo = {
  adminId: string;
};
const AdminDesktopNav = ({ adminId }: AdminInfo) => {
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
        href={`/admin/${adminId}/tutorial`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <NotebookText className="w-5 h-5" />
        <span>教學</span>
      </Link>

      <Link
        href={`/admin/${adminId}/userlist`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <UserRoundPlus className="w-5 h-5" />
        <span>員工</span>
      </Link>

      <Link
        href={`/admin/${adminId}/schedule`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <Clock className="w-5 h-5" />
        <span>排班</span>
      </Link>

      <Link
        href={`/admin/${adminId}/questionform`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <MessageCircleQuestion className="w-5 h-5" />
        <span>諮詢</span>
      </Link>

      <Link
        href={`/admin/${adminId}/adminsetting`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <Settings className="w-5 h-5" />
        <span>設定</span>
      </Link>
    </nav>
  );
};

export default AdminDesktopNav;
