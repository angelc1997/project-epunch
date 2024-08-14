import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquareMousePointer, Headset, Menu, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LandingFooter = () => {
  return (
    <header className="h-20 px-5 border-slate-200 border-2 mt-5 rounded-full">
      <nav className="flex justify-center items-center h-full px-4">
        {/* 首頁 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-primary"
        >
          {/* <SquareMousePointer className="h-5 w-6" /> */}
          <span>Copyright © 2024 ePunch</span>
        </Link>
      </nav>
    </header>
  );
};

export default LandingFooter;
