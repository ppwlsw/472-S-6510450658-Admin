import { Store } from "lucide-react";

export default function AllShop(){
    return (
        <div className="flex flex-col justify-center">
            <div className="w-full flex flex-row justify-between px-10 pt-10 gap-4">
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#C8C3F4]">
                        <Store width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">1750</h1>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row justify-between p-10 gap-4">
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#C8C3F4]">
                        <Store width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">1750</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#FFE3BE]">
                        <Store width={24} height={24} color="#8D4F00"/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าที่ไม่ได้รับการยืนยัน</h1>
                        <h1 className="text-4xl font-medium">50</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}