import ForgotPassword from "@/components/Auth/ForgotPassword";

const ForgotPage = () => {
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center mx-auto ">
      <div className="w-[400px] text-center relative">
        <ForgotPassword />
      </div>
    </div>
  );
};

export default ForgotPage;
