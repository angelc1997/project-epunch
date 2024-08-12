import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquareMousePointer, Headset, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LandingDesktopNav = () => {
  return (
    <header className="h-20 px-5 border-slate-200 border-2 mt-5 rounded-full">
      <nav className="flex justify-between items-center h-full px-4">
        <Link
          href="#"
          className="flex items-center gap-2 justify-center px-6 py-2 rounded-full text-lg hover:text-white hover:bg-primary"
        >
          <Headset className="w-6 h-6" />
          <span>預約諮詢</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-bold hover:text-primary"
        >
          <SquareMousePointer className="h-6 w-6" />
          <span>ePunch點點班</span>
        </Link>
        <Link href="/login">
          <Button className="rounded-full px-6 py-2 text-lg">註冊/登入</Button>
        </Link>
      </nav>
    </header>
  );
};

export default LandingDesktopNav;
