import { Link, Outlet, useLoaderData, useLocation, type LoaderFunctionArgs } from "react-router";

export default function Dashboard() {
    const currentPath = useLocation().pathname;

    function checkpath(path : string) {
        if (currentPath == path){
            return true;
        }
        return false;
    }

    return (
        <div className="flex flex-col justify-center">
            <div className="w-full flex flex-col p-10 gap-10">
                <h1 className="text-2xl font-semibold">
                    ภาพรวม
                </h1>
                <div className="flex flex-row gap-4">
                    <Link to="/dashboard" className={`${checkpath("/dashboard") ? "text-black" : "text-gray-500"} transition-all duration-300 text-xl`}>ทั้งหมด</Link>
                    <Link to="/dashboard/shop" className={`${checkpath("/dashboard/shop") ? "text-black" : "text-gray-500"} transition-all duration-300 text-xl`}>ร้านค้า</Link>
                    <Link to="/dashboard/user" className={`${checkpath("/dashboard/user") ? "text-black" : "text-gray-500"} transition-all duration-300 text-xl`}>ลูกค้า</Link>
                    <Link to="/dashboard/queue" className={`${checkpath("/dashboard/queue") ? "text-black" : "text-gray-500"} transition-all duration-300 text-xl`}>คิว</Link>
                </div>
            </div>
            <div className="w-full h-[0.8px] bg-gray-200"></div>
            <Outlet />
        </div>
    );
}