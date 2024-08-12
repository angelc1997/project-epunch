import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, House, SquareMousePointer } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminMobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="w-6 h-6 text-slate-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4">
          <Link
            href="#"
            className="flex items-center justify-center py-4 px-4 gap-2 text-lg font-bold"
          >
            <SquareMousePointer className="h-6 w-6" />
            <span>ePunch點點班</span>
          </Link>
          <Link
            href="#"
            className="flex items-center py-4 px-4 gap-1 rounded hover:bg-primary hover:text-white"
          >
            <House className="w-5 h-5" />
            <span>員工列表</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileNav;
