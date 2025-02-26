import { Link } from "@remix-run/react";
import { Store } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Sun", count: 10 },
    { name: "Mon", count: 2 },
    { name: "Tue", count: 13 },
    { name: "Wed", count: 5 },
    { name: "Thu", count: 2 },
    { name: "Fri", count: 16 },
    { name: "Sat", count: 23 },
];


export default function DashBoardUser() {
    return(
        <div className="flex flex-col justify-center">
            <div className="w-full flex flex-row justify-between px-10 pt-10 gap-4">
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#C8C3F4]">
                        <Store width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ผู้ใช้ทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">1810</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#FC5A5A]">
                        <Store width={24} height={24} color="#a93d3d"/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ผู้ใช้ที่ถูกระงับ</h1>
                        <h1 className="text-4xl font-medium">50</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#C5FFC2]">
                        <Store width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ผุ้ใช้ที่ใช้งานอยู่ในระบบ</h1>
                        <h1 className="text-4xl font-medium">1700</h1>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row justify-between p-10 gap-4">
                <div className=""></div>
                <div className="w-full h-fit bg-white p-10 rounded-xl shadow-md animate-fade-in flex flex-col gap-6">
                    <h1 className="text-2xl font-medium mb-4">แนวโน้มจำนวนร้านค้าใหม่</h1>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#C8C3F4" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}