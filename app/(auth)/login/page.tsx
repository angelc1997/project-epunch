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
          <div className="absolute">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="myGradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stop-color="#96fbc4" />
                  <stop offset="100%" stop-color="#f9f586" />
                </linearGradient>
              </defs>
              <path
                d="M100 20 
           C130 20, 170 50, 170 100
           C170 130, 150 150, 130 160
           C110 170, 90 170, 70 160
           C50 150, 30 130, 30 100
           C30 50, 70 20, 100 20
           Z"
                fill="url(#myGradient)"
              />
            </svg>
          </div>
          <AuthTabs />
        </div>
      </div>
    </>
  );
};

export default AuthPage;
