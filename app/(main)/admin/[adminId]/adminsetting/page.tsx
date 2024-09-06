"use client";
import AdminMobileNav from "@/components/Navbar/AdminMobileNav";
import UserLoginButton from "@/components/Navbar/UserLoginButton";
import AdminDesktopNav from "@/components/Navbar/AdminDesktopNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { app } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LandingFooter from "@/components/LandingPage/LandingFooter";
import SettingCard from "@/components/DashboardAdmin/AdminSetting/SettingCard";

const auth = getAuth(app);

interface Admin {
  adminId: string;
  companyName: string;
  email: string;
}

const DashboardAdminSetting = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.displayName || !user.email) {
        setAdmin(null);
        router.push("/login");
      } else {
        const adminId = user.uid;
        const companyName = user.displayName;
        const email = user.email;
        setAdmin({ adminId, companyName, email });
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!admin) {
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
        <AdminDesktopNav adminId={admin.adminId} />
        {/* 導航列手機版 */}
        <AdminMobileNav adminId={admin.adminId} />
        {/* 會員資料+登出按鈕 */}
        <UserLoginButton name={admin.companyName} email={admin.email} />
      </header>

      {/* 主要內容區塊 */}
      <main className="mt-10 relative">
        <SettingCard
          adminId={admin.adminId}
          name={admin.companyName}
          email={admin.email}
        />
      </main>
      <LandingFooter />
    </div>
  );
};

export default DashboardAdminSetting;
