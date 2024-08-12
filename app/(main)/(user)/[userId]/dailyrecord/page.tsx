"use client";

import UserMobileNav from "@/components/Navbar/UserMobileNav";
import UserLoginButton from "@/components/Navbar/UserLoginButton";
import UserDesktopNav from "@/components/Navbar/UserDesktopNav";
import UserHomePage from "@/components/DashboardUser/UserHomePage";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const auth = getAuth(app);

interface User {
  userId: string;
  userName: string;
  email: string;
}

const DashboardDailyRecord = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.displayName || !user.email) {
        setUser(null);
        router.push("/login");
      } else {
        const userId = user.uid;
        const userName = user.displayName;
        const email = user.email;
        console.log("user", userId, userName, email);
        setUser({ userId, userName, email });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>正在載入中</div>;
  }

  if (!user) {
    return <div>請先登入</div>;
  }
  return (
    <div className="max-w-[1200px] min-h-screen mx-auto">
      <header className="bg-white flex justify-between items-center h-20 px-5">
        {/* 導航列電腦版 */}
        <UserDesktopNav />
        {/* 導航列手機版 */}
        <UserMobileNav />
        {/* 會員資料+登出按鈕 */}
        <UserLoginButton name={user.userName} email={user.email} />
      </header>

      {/* 主要內容區塊 */}
      <main className="mt-10 relative">
        <UserHomePage />
      </main>
    </div>
  );
};

export default DashboardDailyRecord;
