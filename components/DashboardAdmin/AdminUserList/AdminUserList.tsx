"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddNewUserButton from "./AddNewUserButton";
import ModifyUserInfo from "./ModifyUserInfo";
import DeleteUserInfo from "./DeleteUserInfo";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);
const recordsPerPage = 5;

type EmployeeValue = {
  uid: string;
  department: string;
  name: string;
  email: string;
  password: string;
  employeeId: string;
  tele: string;
  position: string;
  status: string;
  role: string;
};

type Admin = {
  adminId: string;
};

interface Option {
  value: string;
  label: string;
}

const statusOptions = [
  { value: "active", label: "在職" },
  { value: "inactive", label: "離職" },
  { value: "suspended", label: "留職中" },
];

const roleOptions = [
  { value: "manager", label: "主管" },
  { value: "staff", label: "員工" },
];

const optionLabel = (options: Option[], value: string) => {
  const option = options.find((option) => option.value === value);
  return option ? option.label : value;
};

const AdminUserList = ({ adminId }: Admin) => {
  const [employees, setEmployees] = useState<EmployeeValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const q = query(
        collection(db, `admins/${adminId}/allUsers`),
        orderBy("employeeId"),
        limit(recordsPerPage)
      );

      const querySnapshot = await getDocs(q);
      const employeesData = querySnapshot.docs.map(
        (doc) => ({ uid: doc.id, ...doc.data() } as EmployeeValue)
      );

      setEmployees(employeesData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const totalCountSnapshot = await getDocs(
        collection(db, `admins/${adminId}/allUsers`)
      );
      setTotalPages(Math.ceil(totalCountSnapshot.size / recordsPerPage));
    };

    fetchEmployees();
  }, [adminId]);

  const handlePageChange = async (value: string) => {
    const selectedPage = Number(value);
    setCurrentPage(selectedPage);

    const employeesRef = collection(db, `admins/${adminId}/allUsers`);
    let q;

    if (selectedPage === 1) {
      q = query(employeesRef, orderBy("employeeId"), limit(recordsPerPage));
    } else {
      q = query(
        employeesRef,
        orderBy("employeeId"),
        startAfter(lastVisible),
        limit(recordsPerPage)
      );
    }

    const querySnapshot = await getDocs(q);
    const employeesData = querySnapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as EmployeeValue)
    );
    setEmployees(employeesData);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  };

  return (
    <Card>
      <CardHeader className="mt-5 flex items-center text-center gap-2 md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col gap-4">
          <CardTitle>員工列表</CardTitle>
          <CardDescription>
            用於管理員工，進行新增、刪除、編輯等操作
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <AddNewUserButton adminId={adminId} />
          <Select
            onValueChange={handlePageChange}
            value={currentPage.toString()}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="選擇頁數" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(totalPages)].map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  第 {i + 1} 頁
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
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
                分機
              </TableHead>
              <TableHead className="text-center hidden lg:table-cell">
                狀態
              </TableHead>
              <TableHead className="text-center hidden lg:table-cell">
                權限
              </TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.uid}>
                <TableCell className="text-center">
                  {employee.employeeId}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  {employee.department}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  {employee.position}
                </TableCell>
                <TableCell className="text-center">{employee.name}</TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  {employee.email}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  {employee.tele}
                </TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {optionLabel(statusOptions, employee.status)}
                </TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {optionLabel(roleOptions, employee.role)}
                </TableCell>
                <TableCell className="text-center ">
                  <div className="flex justify-center gap-1">
                    <ModifyUserInfo adminId={adminId} userId={employee.uid} />
                    <DeleteUserInfo adminId={adminId} userId={employee.uid} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminUserList;
