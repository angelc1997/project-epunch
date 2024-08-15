"use client";
import AuthTabs from "@/components/Auth/Authtabs";

const AuthPage = () => {
  return (
    <>
      <div className="h-[100vh] flex flex-col justify-center items-center mx-auto ">
        <div className="w-[400px] text-center relative">
          <h1 className="text-3xl font-bold">
            歡迎使用<span className="text-primary">ePunch點點班</span>
          </h1>
          <h4 className="text-lg my-5">初次使用ePunch請先註冊管理員帳號</h4>

          <AuthTabs />
        </div>
      </div>
    </>
  );
};

export default AuthPage;
