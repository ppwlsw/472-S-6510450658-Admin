import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Store,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useFetcher, useLocation } from "react-router";
import { LogoutModal } from "./logout-modal";

interface SidebarItemProps {
  icon: LucideIcon;
  pad?: number;
  gap: number;
  text: string;
  path: string;
  currentPath: string;
  className?: string;
  btClass?: string;
}

export function SidebarItem({
  icon: Icon,
  pad,
  gap,
  text,
  path,
  currentPath,
  className,
  btClass = "bg-white text-[#8A92A6]",
}: SidebarItemProps) {
  const isCurrentPage = currentPath.startsWith(path);

  return (
    <Link to={path}>
      <div
        className={`p-2 cursor-pointer rounded-md transition-all duration-300 ${
          isCurrentPage
            ? `bg-[#3A57E8] bg-opacity-90 text-white hover:bg-opacity-100 scale-105 shadow-md`
            : `${btClass} hover:bg-gray-100 hover:scale-105`
        } ${className}`}
      >
        <div className={`flex items-center px-8 p-${gap} pl-${pad} gap-4`}>
          <Icon width={24} height={24} />
          <h1 className="hidden lg:block">{text}</h1>
        </div>
      </div>
    </Link>
  );
}

function SubSidebarItem({
  icon: Icon,
  pad,
  gap,
  text,
  path,
  currentPath,
  className,
}: SidebarItemProps) {
  const isCurrentPage = currentPath.startsWith(path);

  return (
    <Link to={path} prefetch="viewport">
      <div
        className={`p-2 cursor-pointer rounded-md transition-all duration-300 ${
          isCurrentPage
            ? "bg-[#8A92A6] bg-opacity-90 text-white hover:bg-opacity-100 scale-105 shadow-md"
            : "bg-white text-[#8A92A6] hover:bg-gray-100 hover:scale-105"
        } ${className}`}
      >
        <div className={`flex items-center p-${gap} pl-${pad} gap-4`}>
          <Icon width={24} height={24} />
          <h1>{text}</h1>
        </div>
      </div>
    </Link>
  );
}



export default function SidebarMenu() {
  const { pathname, search } = useLocation();
  const currentPath = pathname + search;
  const [ isPoping, setIsPoping] = useState<boolean>(false);
  return (
    <nav className="fixed top-0 left-0 z-10 h-screen max-sm:hidden sm:w-fit bg-white text-black border-r-[1px] border-r-[rgb(0,0,0,0.09)] lg:w-[257px] transition-all duration-300">
      <div className="w-full flex flex-row justify-between items-center p-4 border-b-[1px] border-b-[rgb(0,0,0,0.1)]">
        <h1 className="text-lg font-semibold">SeeQ-Admin</h1>
      </div>
      <div className="flex flex-col p-4">
        <h1 className="font-medium text-[rgb(0,0,0,0.5)]">Home</h1>
      </div>

      <ul className="flex flex-col flex-1">
        <li className="py-2 px-4">
          <SidebarItem
            icon={LayoutDashboard}
            gap={1}
            text="ภาพรวม"
            path="/dashboard"
            currentPath={currentPath}
            className="shadow-sm"
          />
        </li>
        <li className="py-2 px-4">
          <SidebarItem
            icon={PlusCircle}
            gap={1}
            text="เพิ่มบัญชีร้านค้า"
            path="/createshop"
            currentPath={currentPath}
            className="shadow-sm"
          />
        </li>
        <li className="py-2 px-4">
          <SidebarItem
            icon={Store}
            gap={1}
            text="ร้านค้าทั้งหมด"
            path="/shops"
            currentPath={currentPath}
            className="shadow-sm"
          />
        </li>
        <li className="py-2 px-4">
          <SidebarItem
            icon={Users}
            gap={1}
            text="ลูกค้าทั้งหมด"
            path="/users"
            currentPath={currentPath}
            className="shadow-sm"
          />
        </li>
      </ul>

      <div className="absolute bottom-10 left-0 right-0 py-2 px-4 h-[50%] flex flex-col justify-end gap-3">
        <LogoutModal isPoping={isPoping} setIsPoping={setIsPoping}/>
        <button
          className="h-fit w-full text-center p-2 cursor-pointer rounded-md transition-all duration-300 bg-white bg-opacity-90 text-[#8A92A6] hover:bg-opacity-100 scale-100 hover:bg-white hover:scale-105 hover:text-red-500 hover:border-[1px] hover:cursor-pointer flex flex-row justify-center items-center gap-3 shadow-sm"
          onClick={() => {
            setIsPoping(!isPoping);
          }}
        >
          <LogOut size={20} />
          <p>ออกจากระบบ</p>
        </button>
      </div>
    </nav>
  );
}
