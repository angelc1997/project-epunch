"use client";

import { Button } from "@/components/ui/button";
import { UserRound, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { app } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

const auth = getAuth(app);

interface Admin {
  name?: string;
  email?: string;
}

const UserLoginButton = ({ name, email }: Admin) => {
  const router = useRouter();

  const handleLogout = () => {
    try {
      auth.signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserRound className="w-6 h-6 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex flex-col gap-2 px-5 py-2">
          <span className="font-bold">{name}</span>
          <span>{email}</span>
          <Button onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            登出
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserLoginButton;
