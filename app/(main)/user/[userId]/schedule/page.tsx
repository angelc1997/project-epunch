"use client";
import UserMobileNav from "@/components/Navbar/UserMobileNav";
import UserLoginButton from "@/components/Navbar/UserLoginButton";
import UserDesktopNav from "@/components/Navbar/UserDesktopNav";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import LandingFooter from "@/components/LandingPage/LandingFooter";
import UserSchedule from "@/components/DashboardUser/UserSchedule/UserSchedule";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

interface User {
  userId: string;
  userName: string;
  email: string;
}

const DashboardSchedule = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser || !firebaseUser.email) {
        setUser(null);
        setLoading(false);
        router.push("/login");
      } else {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              userId: firebaseUser.uid,
              userName: userData.name || "未知用戶",
              email: firebaseUser.email,
            });
          } else {
            console.error("找不到使用者");
            setUser(null);
          }
        } catch (error) {
          console.error("連接資料庫失敗:", error);
          setUser(null);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

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
        <UserSchedule userId={user.userId} />
      </main>

      <LandingFooter />
    </div>
  );
};

export default DashboardSchedule;
