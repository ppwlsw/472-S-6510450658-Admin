import { Phone } from "lucide-react";

interface CardDashboardShopProps {
    shop: any;
}

export default function CardDashboardShop({shop}: CardDashboardShopProps) {

    function calStatus() {
        if (shop.is_verified === true && shop.deleted_at != null) {
            return "ถูกระงับ";
        } else if (shop.is_verified === true && shop.deleted_at == null) {
            return "ยืนยันแล้ว";
        } else if (shop.is_verified === false) {
            return "รอยืนยัน";
        }
    }

    return (
        <div className="w-full flex flex-col p-4 gap-3 hover:shadow-xl scale-95 hover:scale-100 hover:cursor-pointer transition-all duration-300">
            <div className="flex flex-row justify-between items-start">
                <div className="w-full flex flex-col">
                    <h1 className="text-xl font-medium line-clamp-1">{shop.name}</h1>
                    <p className="text-[rgb(0,0,0,0.5)] line-clamp-1">{shop.address}</p>
                </div>
                <div className="w-full flex flex-col items-end">
                    <h1 className={`${calStatus() == "ถูกระงับ" ? "text-[#FC5A5A]" : calStatus() == "รอยืนยัน" ? "text-[#8D4F00]" : "text-[#33D117]"}`}>{calStatus()}</h1>
                    <div className="flex flex-row gap-2 items-center">
                        <Phone width={16} height={16} color="#3A57E8" />
                        <div className="flex flex-col">
                            <p className="font-medium line-clamp-1">{shop.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}