"use client";
import AdminMobileNav from "@/components/Navbar/AdminMobileNav";
import UserLoginButton from "@/components/Navbar/UserLoginButton";
import AdminDesktopNav from "@/components/Navbar/AdminDesktopNav";
import AdminUserList from "@/components/DashboardAdmin/AdminUserList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { app } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

interface Admin {
  adminId: string;
  companyName: string;
  email: string;
}

export default function Dashboard() {
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
    return <div>請先登入</div>;
  }

  return (
    <div className="max-w-[1200px] min-h-screen mx-auto">
      <header className="bg-white flex justify-between items-center h-20 px-5">
        {/* 導航列電腦版 */}
        <AdminDesktopNav />
        {/* 導航列手機版 */}
        <AdminMobileNav />
        {/* 會員資料+登出按鈕 */}
        <UserLoginButton name={admin.companyName} email={admin.email} />
      </header>

      {/* 主要內容區塊 */}
      <main className="mt-10 relative">
        <AdminUserList adminId={admin?.adminId} />
      </main>
    </div>
  );
}
