import { Undo2 } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="relative border-slate-200 border-2 rounded-3xl overflow-hidden mt-10">
      <div className="absolute left-[-20px] bottom-[-20px] w-[100px] h-[100px] rounded-full linear-circle"></div>
      <div className="hidden lg:block lg:absolute right-[460px] top-[100px] w-[50px] h-[50px] rounded-full linear-circle"></div>

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-6 lg:p-10">
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-cyan-500">404錯誤</span>
          </h1>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-normal mt-5">
            訪問的地址不存在
          </h3>

          <div className="flex justify-center lg:justify-start mt-8">
            <Link
              href="/"
              className="flex items-center gap-2 justify-center px-6 py-3 rounded-full text-lg bg-primary text-white hover:bg-secondary hover:text-slate-800 transition-colors duration-300"
            >
              <span>返回首頁</span>
              <Undo2 className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src="/assets/weberror.gif"
            alt="Web Error Illustration"
            className="w-full max-w-[500px] -mt-16 lg:-mt-0"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;