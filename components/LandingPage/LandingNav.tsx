import React from "react";
import Link from "next/link";
import { Headset, LogIn } from "lucide-react";

const LandingNav = () => {
  return (
    <header className="h-20 px-5 border-slate-200 border-2 mt-5 rounded-full">
      <nav className="flex justify-between items-center h-full px-4">
        {/* 預約諮詢 */}
        <Link
          href="#section-bookingForm"
          className="hidden md:flex items-center gap-2 justify-center px-6 py-2 rounded-full text-lg hover:text-white hover:bg-primary"
        >
          <Headset className="w-5 h-5" />
          <span className="hidden md:block">預約諮詢</span>
        </Link>

        <Link
          href="#section-bookingForm"
          className="flex items-center justify-center md:hidden hover:rounded-full hover:bg-primary hover:text-white w-12 h-12"
        >
          <Headset className="w-5 h-5" />
        </Link>

        {/* 首頁 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold hover:text-primary"
        >
          {/* <SquareMousePointer className="h-5 w-6" /> */}
          <span>ePunch點點班</span>
        </Link>

        {/* 登入註冊 */}
        <Link
          href="/login"
          className="hidden md:flex items-center gap-2 justify-center px-6 py-2 rounded-full text-lg bg-primary text-white hover:bg-secondary hover:text-slate-800"
        >
          <LogIn className="w-5 h-5" />
          <span className="hidden md:block">登入/註冊</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-center md:hidden hover:rounded-full hover:bg-primary hover:text-white w-12 h-12"
        >
          <LogIn className="w-5 h-5" />
        </Link>
      </nav>
    </header>
  );
};

export default LandingNav;
