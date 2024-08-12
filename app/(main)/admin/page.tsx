import AdminMobileNav from "@/components/Navbar/AdminMobileNav";
import UserLoginButton from "@/components/Navbar/UserLoginButton";
import AdminDesktopNav from "@/components/Navbar/AdminDesktopNav";
import AdminUserList from "@/components/DashboardAdmin/AdminUserList";

export default function Dashboard() {
  return (
    <div className="max-w-[1200px] min-h-screen mx-auto">
      <header className="bg-white flex justify-between items-center h-20 px-5">
        {/* 導航列電腦版 */}
        <AdminDesktopNav />
        {/* 導航列手機版 */}
        <AdminMobileNav />
        {/* 會員資料+登出按鈕 */}
        <UserLoginButton />
      </header>

      {/* 主要內容區塊 */}
      <main className="mt-10 relative">
        <AdminUserList />
      </main>
    </div>
  );
}
