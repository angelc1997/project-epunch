import Link from "next/link";
import {
  House,
  MessageCircleQuestion,
  Settings,
  SquareMousePointer,
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
        <SquareMousePointer className="h-6 w-6" />
        <span>ePunch點點班</span>
      </Link>

      <Link
        href={`/admin/${adminId}/userlist`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <House className="w-5 h-5" />
        <span>員工</span>
      </Link>

      <Link
        href={`/admin/${adminId}/questionform`}
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <Settings className="w-5 h-5" />
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
