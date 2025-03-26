import { Phone } from "lucide-react";
import { useFetcher } from "react-router";
import type { action } from "~/routes/_nav.dashboard._index";

interface CardDashboardShopProps {
    shop: any;
}

export default function CardDashboardShop({ shop }: CardDashboardShopProps) {
    const fetcher = useFetcher<typeof action>();

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
        <fetcher.Form method="post">
            <input type="hidden" name="shopId" value={shop.id ?? ""} />
            <input type="hidden" name="name" value={shop.name ?? ""} />
            <input type="hidden" name="email" value={shop.email ?? ""} />
            <input type="hidden" name="address" value={shop.address ?? ""} />
            <input type="hidden" name="phone" value={shop.phone ?? ""} />
            <input type="hidden" name="description" value={shop.description ?? ""} />
            <input type="hidden" name="is_verified" value={shop.is_verified ?? ""} />
            <input type="hidden" name="image_url" value={shop.image_url ?? ""} />
            <input type="hidden" name="is_open" value={shop.is_open ?? ""} />
            <input type="hidden" name="latitude" value={shop.latitude ?? ""} />
            <input type="hidden" name="longitude" value={shop.longitude ?? ""} />
            <input type="hidden" name="created_at" value={shop.created_at ?? ""} />
            <input type="hidden" name="updated_at" value={shop.updated_at ?? ""} />
            <input type="hidden" name="deleted_at" value={shop.deleted_at ?? ""} />


            <button name="_action" value="show_shop" type="submit" className="w-full flex flex-col p-4 gap-3 hover:shadow-xl scale-95 hover:scale-100 hover:cursor-pointer transition-all duration-300">
                <div className="flex flex-row justify-between items-start">
                    <div className="w-full flex flex-col items-start">
                        <h1 className="text-xl font-medium line-clamp-1">{shop.name}</h1>
                        <p className="text-[rgb(0,0,0,0.5)] line-clamp-1 text-start">{shop.address}</p>
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
            </button>
        </fetcher.Form>
    );
}