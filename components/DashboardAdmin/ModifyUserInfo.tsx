import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";

const ModifyUserInfo = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SquarePen className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯員工資料</DialogTitle>
          <DialogDescription>請輸入您要編輯的員工資料欄位</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div>
            <Label>員編</Label>
            <Input name="employeeId" className="mt-2" placeholder="ex:A001" />
          </div>
          <div>
            <Label>姓名</Label>
            <Input name="name" className="mt-2" placeholder="ex:王小明" />
          </div>
        </div>

        <div className="flex gap-2">
          <div>
            <Label>部門</Label>
            <Input
              name="department"
              className="mt-2"
              placeholder="ex:人力資源處"
            />
          </div>
          <div>
            <Label>職位</Label>
            <Input name="position" className="mt-2" placeholder="ex:工程師" />
          </div>
        </div>

        <div>
          <Label>信箱</Label>
          <Input
            name="email"
            className="mt-2"
            placeholder="ex: employee@example.com"
          />
        </div>

        <div>
          <Label>密碼</Label>
          <Input
            name="password"
            className="mt-2"
            autoComplete="new-password"
            placeholder="如:123456"
          />
        </div>

        <div>
          <Label>分機</Label>
          <Input className="mt-2" placeholder="分機" name="tele" />
        </div>

        <div className="flex gap-2">
          <div className="w-full">
            <Label>狀態</Label>
            <div className="mt-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="狀態" />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full">
            <Label>權限</Label>
            <div className="mt-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="權限" />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline">取消</Button>
          <Button>確認新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyUserInfo;
