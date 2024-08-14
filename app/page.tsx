import LandingMain from "@/components/LandingPage/LandingMain";
import LandingNav from "@/components/LandingPage/LandingNav";

const Home = () => {
  return (
    <>
      <div className="max-w-[1200px] min-h-screen mx-auto ">
        <LandingNav />

        {/* 主要內容區塊 */}
        <main className="relative">
          <LandingMain />
        </main>
      </div>
    </>
  );
};

export default Home;
