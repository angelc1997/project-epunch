import LandingDesktopNav from "@/components/LandingPage/LandingDesktopNav";
import LandingMain from "@/components/LandingPage/LandingMain";

const Home = () => {
  return (
    <>
      <div className="max-w-[1200px] min-h-screen mx-auto ">
        <LandingDesktopNav />

        {/* 主要內容區塊 */}
        <main className="relative">
          <LandingMain />
        </main>
      </div>
    </>
  );
};

export default Home;
