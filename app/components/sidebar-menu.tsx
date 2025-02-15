import { Link, useLocation } from "@remix-run/react";
import { LayoutDashboard, Store, User, Users, PlusCircle, LucideIcon } from "lucide-react";

interface SidebarItemProps {
    icon: LucideIcon;
    pad?: number;
    gap: number;
    text: string;
    path: string;
    currentPath: string;
    className?: string;
}

function SidebarItem({icon: Icon, pad, gap, text, path, currentPath, className}: SidebarItemProps) {
    const isCurrentPage = currentPath.startsWith(path);

    return (
        <Link to={path.endsWith("dashboard") ? "/dashboard/shop" : path} prefetch='viewport'>
            <div className={`p-2 cursor-pointer rounded-md transition-all duration-300 ${isCurrentPage ? "bg-[#3A57E8] bg-opacity-90 text-white hover:bg-opacity-100 scale-105 shadow-md" : "bg-white text-[#8A92A6] hover:bg-gray-100 hover:scale-105"} ${className}`}>
                <div className={`flex items-center p-${gap} pl-${pad} gap-4`}>
                    <Icon width={24} height={24} />
                    <h1>{text}</h1>
                </div>
            </div>
        </Link>
    );
}

function SubSidebarItem({icon: Icon, pad, gap, text, path, currentPath, className}: SidebarItemProps) {
    const isCurrentPage = currentPath.startsWith(path);

    return (
        <Link to={path} prefetch='viewport'>
            <div className={`p-2 cursor-pointer rounded-md transition-all duration-300 ${isCurrentPage ? "bg-[#8A92A6] bg-opacity-90 text-white hover:bg-opacity-100 scale-105 shadow-md" : "bg-white text-[#8A92A6] hover:bg-gray-100 hover:scale-105"} ${className}`}>
                <div className={`flex items-center p-${gap} pl-${pad} gap-4`}>
                    <Icon width={24} height={24} />
                    <h1>{text}</h1>
                </div>
            </div>
        </Link>
    );
}

export default function SidebarMenu() {
    const currentPath = useLocation().pathname;

    return (
        <nav className="bg-white text-black border-r-[1px] border-r-[rgb(0,0,0,0.09)] shadow-2xl">
        <div className="w-full flex flex-row justify-between items-center p-4 border-b-[1px] border-b-[rgb(0,0,0,0.1)]">
            <h1 className="text-lg font-semibold">
            SeeQ-Admin
            </h1>
        </div>
        <div className="flex flex-col p-4">
            <h1 className="font-medium text-[rgb(0,0,0,0.5)]">
                Home
            </h1>
        </div>
        <ul className="flex flex-col">
            <li className="py-2 px-4">
                <SidebarItem icon={LayoutDashboard} gap={1} text="ภาพรวม"  path="/dashboard" currentPath={currentPath} className="rounded-b-none border-b-[1px] border-white shadow-sm"/>
                <ul className="">
                    <li className="">
                        <SubSidebarItem icon={Store} pad={6} gap={1} text="ร้านค้า"  path="/dashboard/shop" currentPath={currentPath} className="rounded-none shadow-sm pl-8"/>
                    </li>
                    <li className="">
                        <SubSidebarItem icon={User} pad={6} gap={1} text="ผู้ใช้"  path="/dashboard/user" currentPath={currentPath} className="rounded-t-none shadow-sm pl-8"/>
                    </li>
                </ul>
            </li>
            <li className="py-2 px-4">
                <SidebarItem icon={PlusCircle} gap={1} text="เพิ่มบัญชีร้านค้า" path="/createshop" currentPath={currentPath} className="shadow-sm"/>
            </li>
            <li className="py-2 px-4">
                <SidebarItem icon={Store} gap={1} text="ร้านค้าทั้งหมด" path="/allshop" currentPath={currentPath} className="shadow-sm"/>
            </li>
            <li className="py-2 px-4">
                <SidebarItem icon={Users} gap={1} text="ผู้ใช้ทั้งหมด" path="/alluser" currentPath={currentPath} className="shadow-sm"/>
            </li>
        </ul>
        </nav>
    );
}