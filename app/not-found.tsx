import Link from "next/link";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/LandingPage/LandingNav";
import NotFoundPage from "@/components/Others/NotFounPage";
import LandingFooter from "@/components/LandingPage/LandingFooter";

const NotFound = () => {
  return (
    <div className="max-w-[1200px] min-h-screen mx-auto ">
      <LandingNav />
      <NotFoundPage />
      <LandingFooter />
    </div>
  );
};

export default NotFound;
