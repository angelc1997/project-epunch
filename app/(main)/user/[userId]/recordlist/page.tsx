"use client";
import UserMobileNav from "@/components/Navbar/UserMobileNav";
import UserLoginButton from "@/components/Navbar/UserLoginButton";
import UserDesktopNav from "@/components/Navbar/UserDesktopNav";
import UserRecordList from "@/components/DashboardUser/UserRecordList/UserRecordList";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import LandingFooter from "@/components/LandingPage/LandingFooter";

const auth = getAuth(app);

interface User {
  userId: string;
  userName: string;
  email: string;
}

const DashboardRecordList = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.displayName || !user.email) {
        setUser(null);
        router.push("/login");
      } else {
        const userId = user.uid;
        const userName = user.displayName;
        const email = user.email;
        setUser({ userId, userName, email });
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="max-w-[1200px] min-h-screen mx-auto">
      <header className="bg-white flex justify-between items-center h-20 px-5">
        {/* 導航列電腦版 */}
        <UserDesktopNav userId={user.userId} />
        {/* 導航列手機版 */}
        <UserMobileNav userId={user.userId} />
        {/* 登出按鈕 */}
        <UserLoginButton name={user.userName} email={user.email} />
      </header>

      {/* 主要內容區塊 */}
      <main className="mt-10 relative">
        <UserRecordList userId={user.userId} />
      </main>

      <LandingFooter />
    </div>
  );
};

export default DashboardRecordList;
