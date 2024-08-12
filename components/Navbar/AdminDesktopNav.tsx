import Link from "next/link";
import { House, SquareMousePointer } from "lucide-react";

const AdminDesktopNav = () => {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-bold md:flex md:flex-row md:items-center">
      <Link
        href="/admin"
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <SquareMousePointer className="h-6 w-6" />
        <span>ePunch點點班</span>
      </Link>

      <Link
        href="#"
        className="flex items-center gap-2 justify-center hover:text-primary"
      >
        <House className="w-5 h-5" />
        <span>員工列表</span>
      </Link>
    </nav>
  );
};

export default AdminDesktopNav;
