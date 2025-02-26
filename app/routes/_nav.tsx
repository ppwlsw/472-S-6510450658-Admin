import { Outlet, useLocation } from "@remix-run/react";
import SidebarMenu from "~/components/sidebar-menu";

export default function Nav() {
    const currentPath = useLocation().pathname;

    const pageTitles: Record<string, string> = {
        "/dashboard/shop": "ภาพรวมของร้านค้า",
        "/dashboard/user": "ภาพรวมของผู้ใช้",
        "/createshop": "เพิ่มบัญชีร้านค้า",
        "/shops": "ร้านค้าทั้งหมด",
        "/users": "ผู้ใช้ทั้งหมด",
    };

    return (
        <div className="grid grid-cols-[1fr_5fr] min-h-screen">
            <SidebarMenu />
            <div className="w-[257px]"></div>
            <main className="bg-gray-100">
                <div className="w-full flex flex-row justify-between items-center p-4 border-b-[1px] border-b-[rgb(0,0,0,0.1)] bg-white text-black">
                    <h1 className="text-lg font-semibold">
                        {pageTitles[currentPath]}
                    </h1>
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <div className="p-4 bg-[rgb(0,0,0,0.1)] rounded-full"></div>
                        <h1 className="">Austin Robertson</h1>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
}