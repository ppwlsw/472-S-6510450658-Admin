import { Phone } from "lucide-react";
import { useFetcher } from "react-router";

interface CardDashboardUserProps {
    user: any;
}

export default function CardDashboardUser({ user }: CardDashboardUserProps) {
    const fetcher = useFetcher();
    function calStatus() {
        if (user.is_verified === true && user.deleted_at != null) {
            return "ถูกระงับ";
        } else if (user.is_verified === true && user.deleted_at == null) {
            return "ยืนยันแล้ว";
        } else if (user.is_verified === false) {
            return "รอยืนยัน";
        }
    }

    return (
        <fetcher.Form method="post">
            <input type="hidden" name="userId" value={user.id ?? ""} />
            <input type="hidden" name="name" value={user.name ?? ""} />
            <input type="hidden" name="email" value={user.email ?? ""} />
            <input type="hidden" name="phone" value={user.phone ?? ""} />
            <input type="hidden" name="role" value={user.role ?? ""} />
            <input type="hidden" name="is_verified" value={user.is_verified ?? ""} />
            <input type="hidden" name="image_url" value={user.image_url ?? ""} />
            <input type="hidden" name="created_at" value={user.created_at ?? ""} />
            <input type="hidden" name="updated_at" value={user.updated_at ?? ""} />
            <input type="hidden" name="deleted_at" value={user.deleted_at ?? ""} />

            <button name="_action" value="show_user" type="submit" className="w-full flex flex-col p-4 gap-3 hover:shadow-xl scale-95 hover:scale-100 hover:cursor-pointer transition-all duration-300">
                <div className="flex flex-row justify-between items-start">
                    <div className="w-full flex flex-col">
                        <h1 className="text-xl font-medium line-clamp-1 text-start">{user.name}</h1>
                    </div>
                    <div className="w-full flex flex-col items-end">
                        <h1 className={`${calStatus() == "ถูกระงับ" ? "text-[#FC5A5A]" : calStatus() == "รอยืนยัน" ? "text-[#8D4F00]" : "text-[#33D117]"}`}>{calStatus()}</h1>
                        <div className="flex flex-row gap-2 items-center">
                            <Phone width={16} height={16} color="#3A57E8" />
                            <div className="flex flex-col">
                                <p className="font-medium line-clamp-1">{user.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </fetcher.Form>
    );
}