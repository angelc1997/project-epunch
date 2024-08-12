"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddNewUserButton from "./AddNewUserButton";
import ModifyUserInfo from "./ModifyUserInfo";
import DeleteUserInfo from "./DeleteUserInfo";

const AdminUserList = () => {
  return (
    <Card>
      <CardHeader className="mt-5 flex items-center text-center gap-2 md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col gap-4">
          <CardTitle>員工列表</CardTitle>
          <CardDescription>
            用於管理員工，進行新增、刪除、編輯等操作
          </CardDescription>
        </div>
        <div>
          <AddNewUserButton />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          {/* 表頭 */}
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">員編</TableHead>
              <TableHead className="text-center hidden md:table-cell">
                部門
              </TableHead>
              <TableHead className="text-center hidden md:table-cell">
                職位
              </TableHead>
              <TableHead className="text-center">姓名</TableHead>
              <TableHead className="text-center hidden md:table-cell">
                信箱
              </TableHead>
              <TableHead className="text-center hidden md:table-cell">
                密碼
              </TableHead>
              <TableHead className="text-center hidden md:table-cell">
                分機
              </TableHead>
              <TableHead className="text-center hidden lg:table-cell">
                狀態
              </TableHead>
              <TableHead className="text-center hidden lg:table-cell">
                身分
              </TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>

          {/* 表格內容 */}
          <TableBody>
            <TableRow>
              <TableCell className="text-center">A001</TableCell>
              <TableCell className="text-center hidden md:table-cell">
                人力發展處
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                資深工程師
              </TableCell>
              <TableCell className="text-center">李其明</TableCell>
              <TableCell className="text-center hidden md:table-cell">
                liqimin@gmail.com
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                123456
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                #1234
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell">
                在職
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell">
                員工
              </TableCell>
              <TableCell className="text-center ">
                <div className="flex justify-center gap-1">
                  <ModifyUserInfo />
                  <DeleteUserInfo />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminUserList;
