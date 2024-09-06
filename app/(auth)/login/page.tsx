"use client";
import Image from "next/image";
import AuthTabs from "@/components/Auth/Authtabs";

const AuthPage = () => {
  return (
    <>
      <div className="h-[100vh] flex flex-col justify-center items-center mx-auto ">
        <div className="w-[400px] text-center relative">
          <div className="flex justify-center mb-5">
            <Image
              src="/assets/LOGO.png"
              alt="ePunch-logo"
              width={50}
              height={50}
            />
          </div>

          <h1 className="text-3xl font-bold">
            歡迎使用<span className="text-cyan-500">ePunch點點班</span>
          </h1>
          <h4 className="text-lg my-5">初次使用ePunch請先註冊管理員帳號</h4>

          <AuthTabs />
        </div>
      </div>
    </>
  );
};

export default AuthPage;
