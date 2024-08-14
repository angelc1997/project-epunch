import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <div>
        <h1>404 - 頁面未找到</h1>
        <p>你要找的頁面不存在</p>
      </div>
      <Link href="/">
        <Button>返回首頁</Button>
      </Link>
    </>
  );
}
