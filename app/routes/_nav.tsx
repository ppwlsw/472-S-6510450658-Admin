import { Outlet, useLocation, type LoaderFunctionArgs } from "react-router";
import SidebarMenu, { SidebarItem } from "~/components/sidebar-menu";
import {
  LayoutDashboard,
  PlusCircle,
  ShieldUser,
  Store,
  Users,
} from "lucide-react";
import { useAuth } from "~/utils/auth";

export async function loader( { request }: LoaderFunctionArgs) {
  const  { validate } = useAuth;
  await validate({ request });
}

export default function Nav() {
  const currentPath = useLocation().pathname;

  const pageTitles: Record<string, string> = {
    "/dashboard": "ภาพรวมทั้งหมด",
    "/dashboard/queue": "ภาพรวมของคิว",
    "/dashboard/shop": "ภาพรวมของร้านค้า",
    "/dashboard/user": "ภาพรวมของผู้ใช้",
    "/createshop": "เพิ่มบัญชีร้านค้า",
    "/shops": "ร้านค้าทั้งหมด",
    "/users": "ผู้ใช้ทั้งหมด",
  };

  return (
    <div className="flex flex-row min-h-screen">
      <SidebarMenu />
      <nav className="h-screen max-sm:hidden sm:w-fit lg:w-[257px] bg-white border-r-[1px] border-r-[rgb(0,0,0,0.09)] transition-all duration-300">
        <div className="w-full flex flex-row justify-between items-center p-4 border-b-[1px] border-b-[rgb(0,0,0,0.1)]">
          <h1 className="text-lg font-semibold text-nowrap">SeeQ-Admin</h1>
        </div>
        <div className="flex flex-col p-4">
          <h1 className="font-medium text-[rgb(0,0,0,0.5)] text-nowrap">
            Home
          </h1>
        </div>

        <ul className="flex flex-col flex-1">
          <li className="py-2 px-4">
            <SidebarItem
              icon={LayoutDashboard}
              gap={1}
              text="ภาพรวม"
              path="/dashboard"
              currentPath={currentPath}
              className="shadow-sm text-nowrap"
            />
          </li>
          <li className="py-2 px-4">
            <SidebarItem
              icon={PlusCircle}
              gap={1}
              text="เพิ่มบัญชีร้านค้า"
              path="/createshop"
              currentPath={currentPath}
              className="shadow-sm text-nowrap"
            />
          </li>
          <li className="py-2 px-4">
            <SidebarItem
              icon={Store}
              gap={1}
              text="ร้านค้าทั้งหมด"
              path="/shops"
              currentPath={currentPath}
              className="shadow-sm text-nowrap"
            />
          </li>
          <li className="py-2 px-4">
            <SidebarItem
              icon={Users}
              gap={1}
              text="ลูกค้าทั้งหมด"
              path="/users"
              currentPath={currentPath}
              className="shadow-sm text-nowrap"
            />
          </li>
        </ul>
      </nav>
      <main className="w-full bg-gray-100">
        <div className="z-20 w-full flex flex-row justify-between items-center p-4 border-b-[1px] border-b-[rgb(0,0,0,0.1)] bg-white text-black">
          <h1 className="text-lg font-semibold">{pageTitles[currentPath]}</h1>
          <div className="flex flex-row gap-2 justify-center items-center">
            <ShieldUser size={36}></ShieldUser>
            <h1 className="">Admin</h1>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
