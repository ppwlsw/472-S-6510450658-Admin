import { Phone } from "lucide-react";

export default function CardDashboardShop() {
    return (
        <div className="w-full flex flex-col p-4 border-[1px] border-[rgb(0,0,0,0.1)] rounded-xl shadow-lg gap-6 hover:shadow-xl hover:scale-105 hover:cursor-pointer transition-all duration-300">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-xl">ประเภทร้าน</h1>
                <div className="px-3 py-2 bg-[#DAFFD9] flex items-center justify-center rounded-md text-[#33D117]">
                    ยืนยันแล้ว
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-medium">ชื่อร้าน</h1>
                <p className="text-[rgb(0,0,0,0.5)]">ที่อยู่ร้าน</p>
            </div>
            <div className="w-full h-[0.8px] bg-[rgb(0,0,0,0.09)] my-2"></div>
            <div className="flex flex-row gap-6 items-center">
                <Phone width={24} height={24} color="#3A57E8" />
                <div className="flex flex-col">
                    <h1 className="text-xl text-[rgb(0,0,0,0.5)]">ช่องทางการติดต่อ</h1>
                    <p className="font-medium">098-192-3830</p>
                </div>
            </div>
        </div>
    );
}