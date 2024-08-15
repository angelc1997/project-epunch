import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthTabs = () => {
  return (
    <Tabs defaultValue="login">
      <TabsList className="grid w-full grid-cols-2 rounded-full">
        <TabsTrigger value="login">登入</TabsTrigger>
        <TabsTrigger value="register">註冊</TabsTrigger>
      </TabsList>
      <div className="mt-5">
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AuthTabs;
