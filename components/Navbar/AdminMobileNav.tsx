import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MessageCircleQuestion,
  Settings,
  Clock,
  NotebookText,
  UserRoundPlus,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type AdminInfo = {
  adminId: string;
};
const AdminMobileNav = ({ adminId }: AdminInfo) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
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
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileNav;
