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

// const departmentOptions = [
//   { value: "hr", label: "人力部" },
//   { value: "it", label: "資訊部" },
//   { value: "marketing", label: "行銷部" },
//   { value: "sales", label: "業務部" },
//   { value: "finance", label: "財務部" },
//   { value: "admin", label: "管理部" },
// ];

// const positionOptions = [
//   { value: "engineer", label: "工程師" },
//   { value: "designer", label: "設計師" },
//   { value: "accountant", label: "會計師" },
//   { value: "sales", label: "業務員" },
//   { value: "specialist", label: "專員" },
// ];

const statusOptions = [
  { value: "active", label: "在職" },
  { value: "inactive", label: "離職" },
  { value: "suspended", label: "留職中" },
];

const roleOptions = [
  { value: "manager", label: "主管" },
  { value: "staff", label: "員工" },
];

const AddNewUserButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>新增員工</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增員工表單</DialogTitle>
          <DialogDescription>請輸入您要新增的員工資料</DialogDescription>
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
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
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
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
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

export default AddNewUserButton;
