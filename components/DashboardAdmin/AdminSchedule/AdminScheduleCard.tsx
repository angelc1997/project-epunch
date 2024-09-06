"use client";
import React, { useEffect, useState } from "react";
import { Check, Plus, Settings2, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { app } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
  writeBatch,
  orderBy,
} from "firebase/firestore";

const db = getFirestore(app);
const recordsPerPage = 5;

interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isEditing: boolean;
}

interface User {
  id: string;
  employeeId: string;
  name: string;
  status: string;
  scheduleUpdate: string;
  weeklySchedule: {
    [key: string]: string;
  };
  isEditing: boolean;
}

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

const AdminScheduleCard = ({ adminId }: { adminId: string }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSchedules();
    fetchUsers();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(users.length / recordsPerPage));
  }, [users]);

  const handlePageChange = (value: string) => {
    setCurrentPage(parseInt(value));
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // 獲取schedule
  const fetchSchedules = async () => {
    try {
      const adminCollection = collection(db, `admins/${adminId}/schedules`);
      const querySnapshot = await getDocs(adminCollection);
      const schedulesList = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            isEditing: false,
          } as Schedule)
      );
      setSchedules(schedulesList);
    } catch (error) {
      console.error("獲取schedule失敗:", error);
    }
  };

  // 獲取active的users
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, `admins/${adminId}/allUsers`);
      const activeUsersQuery = query(
        usersCollection,
        where("status", "==", "active")
      );
      const querySnapshot = await getDocs(activeUsersQuery);

      const activeUsers: User[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<User, "id">;
        return {
          id: doc.id,
          employeeId: data.employeeId,
          name: data.name,
          status: data.status,
          scheduleUpdate: data.scheduleUpdate || "",
          weeklySchedule: data.weeklySchedule || {
            一: "",
            二: "",
            三: "",
            四: "",
            五: "",
            六: "",
            日: "",
          },
          isEditing: false,
        };
      });

      setUsers(activeUsers);
    } catch (error) {
      console.error("獲取users失敗:", error);
    }
  };

  // 新增schedule
  const addSchedule = async () => {
    const newSchedule = {
      name: "",
      startTime: "",
      endTime: "",
    };

    try {
      const docRef = await addDoc(
        collection(db, `admins/${adminId}/schedules`),
        newSchedule
      );
      setSchedules([
        ...schedules,
        { ...newSchedule, id: docRef.id, isEditing: true },
      ]);
    } catch (error) {
      console.error("新增schedule失敗:", error);
    }
  };

  // 刪除schedule
  const deleteSchedule = async (id: string) => {
    try {
      await deleteDoc(doc(db, `admins/${adminId}/schedules`, id));
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (error) {
      console.error("刪除schedule失敗:", error);
    }
  };

  // 更新schedule
  const updateSchedule = async (id: string, field: string, value: string) => {
    try {
      const updateSchedule = schedules.find((schedule) => schedule.id === id);
      if (updateSchedule) {
        const updateRef = doc(db, `admins/${adminId}/schedules`, id);
        await updateDoc(updateRef, { [field]: value });
        setSchedules(
          schedules.map((schedule) =>
            schedule.id === id ? { ...schedule, [field]: value } : schedule
          )
        );
      }
    } catch (error) {
      console.error("更新schedule失敗:", error);
    }
  };

  // 編輯schedule
  const handleNameChange = (id: string, value: string) => {
    setSchedules((prevSchedules) =>
      prevSchedules.map((schedule) =>
        schedule.id === id ? { ...schedule, name: value } : schedule
      )
    );
  };

  // 處理輸入問題
  const handleNameBlur = (id: string, value: string) => {
    updateSchedule(id, "name", value);
  };

  // 編輯使用者
  const toggleEdit = (id: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, isEditing: !schedule.isEditing }
          : schedule
      )
    );
  };

  // 更新使用者schedule
  const updateUserSchedule = async (
    userId: string,
    day: string,
    scheduleId: string
  ) => {
    try {
      const batch = writeBatch(db);
      const currentDate = new Date().toISOString().split("T")[0];

      // 更新管理員doc裡面的schedule
      const adminUserRef = doc(db, `admins/${adminId}/allUsers`, userId);
      batch.update(adminUserRef, {
        [`weeklySchedule.${day}`]: scheduleId || "",
        scheduleUpdate: currentDate,
      });

      // 更新用戶自己的schedule
      const userRef = doc(db, `users`, userId);
      batch.update(userRef, {
        [`weeklySchedule.${day}`]: scheduleId || "",
        scheduleUpdate: currentDate,
      });

      // 執行批量寫入
      await batch.commit();

      // 更新狀態
      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                weeklySchedule: {
                  ...user.weeklySchedule,
                  [day]: scheduleId || "",
                },
                scheduleUpdate: currentDate,
              }
            : user
        )
      );
    } catch (error) {
      console.error("更新使用者schedule失敗:", error);
    }
  };

  const toggleUserEdit = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isEditing: !user.isEditing } : user
      )
    );
  };

  // 樣式顯示 預設default、有空為outline、off(放假)為secondary
  const getBadgeVariant = (scheduleId: string) => {
    if (scheduleId === "" || scheduleId === undefined) return "outline";
    if (scheduleId === "off") return "secondary";
    return "default";
  };

  // 字顯示 無為"未設定"、off為"休假"
  const getScheduleDisplay = (scheduleId: string) => {
    if (scheduleId === "" || scheduleId === undefined) return "未設定";
    if (scheduleId === "off") return "休假";
    return schedules.find((s) => s.id === scheduleId)?.name || "未設定";
  };

  return (
    <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-4">
      <Card className="col-span-1">
        <CardHeader className="flex flex-col justify-between">
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            排班設定
          </CardTitle>
          <CardDescription>
            設定各班別名稱以及上下班時間，以提醒員工打卡時間，可點選編輯按鈕或是新增其他班別。
          </CardDescription>
        </CardHeader>
      </Card>

      {schedules.map((schedule) => (
        <Card key={schedule.id} className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-muted-foreground">
              {schedule.isEditing ? (
                <Input
                  className="w-full h-10"
                  placeholder="班別名稱"
                  value={schedule.name}
                  onChange={(e) =>
                    handleNameChange(schedule.id, e.target.value)
                  }
                  onBlur={(e) => handleNameBlur(schedule.id, e.target.value)}
                />
              ) : (
                <div>{schedule.name}</div>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleEdit(schedule.id)}
                className="h-10 w-10 p-0"
              >
                {schedule.isEditing ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Settings2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteSchedule(schedule.id)}
                className="h-10 w-10 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {schedule.isEditing ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <Label className="text-base text-muted-foreground">
                      開始時間
                    </Label>
                    <Input
                      type="time"
                      className="flex-grow h-10"
                      value={schedule.startTime}
                      onChange={(e) =>
                        updateSchedule(schedule.id, "startTime", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <Label className="text-base text-muted-foreground">
                      結束時間
                    </Label>
                    <Input
                      type="time"
                      className="flex-grow h-10"
                      value={schedule.endTime}
                      onChange={(e) =>
                        updateSchedule(schedule.id, "endTime", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {schedule.startTime === "" || schedule.endTime === ""
                    ? ""
                    : `${`${schedule.startTime} - ${schedule.endTime}`}`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="col-span-1 border-0 flex items-center justify-center">
        <Button onClick={addSchedule}>
          <Plus />
          新增
        </Button>
      </Card>

      <Card className="md:col-span-4">
        <CardHeader className="mt-5 flex items-center text-center gap-2 md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col gap-4">
            <CardTitle>員工列表</CardTitle>
            <CardDescription>使用編輯按鈕設定各員工上班班別</CardDescription>
          </div>

          <div className="flex items-center gap-4">
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
                <TableHead className="text-center">姓名</TableHead>
                {weekDays.map((day) => (
                  <TableHead key={day} className="text-center">
                    {day}
                  </TableHead>
                ))}
                <TableHead className="text-center">最新更新</TableHead>
                <TableHead className="text-center">編輯</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="text-center">
                  <TableCell>{user.employeeId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  {weekDays.map((day) => (
                    <TableCell key={day}>
                      {user.isEditing ? (
                        <Select
                          onValueChange={(value) =>
                            updateUserSchedule(user.id, day, value)
                          }
                          defaultValue={user.weeklySchedule[day]}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="班次" />
                          </SelectTrigger>
                          <SelectContent>
                            {schedules.map((schedule) => (
                              <SelectItem key={schedule.id} value={schedule.id}>
                                {schedule.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="off">休假</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={getBadgeVariant(user.weeklySchedule[day])}
                        >
                          {getScheduleDisplay(user.weeklySchedule[day])}
                        </Badge>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>{user.scheduleUpdate}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserEdit(user.id)}
                    >
                      {user.isEditing ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <SquarePen className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminScheduleCard;
