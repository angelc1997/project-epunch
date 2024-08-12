import UserMobileNav from "@/components/Navbar/UserMobileNav";
import UserLoginButton from "@/components/Navbar/UserLoginButton";
import UserDesktopNav from "@/components/Navbar/UserDesktopNav";
import UserRecordList from "@/components/DashboardUser/UserRecordList";

const DashboardRecordList = () => {
  return (
    <div className="max-w-[1200px] min-h-screen mx-auto">
      <header className="bg-white flex justify-between items-center h-20 px-5">
        {/* 導航列電腦版 */}
        <UserDesktopNav />
        {/* 導航列手機版 */}
        <UserMobileNav />
        {/* 會員資料+登出按鈕 */}
        <UserLoginButton />
      </header>

      {/* 主要內容區塊 */}
      <main className="mt-10 relative">
        <UserRecordList />
      </main>
    </div>
  );
};

export default DashboardRecordList;
