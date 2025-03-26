import { type LoaderFunctionArgs } from "react-router";
import { Link, redirect, useFetcher, useLoaderData } from "react-router";
import { ChevronRight, User2 } from "lucide-react";
import Provider, { setDefaultProvider } from "~/provider";
import { useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs){
    const { getCookie } = useAuth
    const auth = await getCookie({ request: request });
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    
    const res1 = await fetch(`${process.env.API_BASE_URL}/users/withTrashed`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
        }
    }
    );


    const res = await fetch(`${process.env.API_BASE_URL}/users/withTrashedPaginate?page=${page}` , {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
        }
    }
    );

    const jsonAlldata = await res1.json();
    const jsonData = await res.json();

    const data = jsonAlldata.data;
    const totalUsers = data.length;
    const totalBan = data.filter((user: any) => user.is_verified === true && user.deleted_at != null).length;
    const totalConfirm = data.filter((user: any) => user.is_verified === true && user.deleted_at == null).length;
    const totalPending = data.filter((user: any) => user.is_verified === false).length;

    const stats = {
        totalUsers: totalUsers,
        totalBan: totalBan,
        totalConfirm: totalConfirm,
        totalPending: totalPending
    }

    return {
        users: jsonData.data,
        paginationLinks: jsonData.links,
        paginationMeta: jsonData.meta,
        stats: stats
    };
}

export async function action({ request }: { request: Request }) {
    
    const formData = await request.formData();

    if (formData.get("_action") === "search") {

        return redirect("/users?page=1");
    }

    if (formData.get("_action") === "show") {
        const userId = formData.get("userId");

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const role = formData.get("role") as string;
        const phone = formData.get("phone") as string;
        const is_verified = formData.get("is_verified");
        const image_url = formData.get("image_url") as string;
        const created_at = formData.get("created_at") as string;
        const updated_at = formData.get("updated_at") as string;
        const deleted_at = formData.get("deleted_at") as string;

        const userIdStr = userId?.toString();
        if (!userIdStr) return redirect("/users");
        
        const shop = Provider.Provider[userIdStr];
        if (!shop) {
            setDefaultProvider(Number(userId));
        }

        Provider.UserProvider[userIdStr] = {
            userfilter: {
                id: userIdStr,
                name: name,
                email: email,
                phone: phone,
                role: role,
                image_url: image_url,
                is_verified: is_verified === "true",
                created_at: created_at?.toString() ?? "",
                updated_at: updated_at?.toString() ?? "",
                deleted_at: deleted_at?.toString() ?? ""
            }
        };

        return redirect(`/user/${userId}`);
    }
}

export default function Users(){
    // const { shops, paginationLinks, paginationMeta, name, status, stats } = useLoaderData<typeof loader>();
    const { users, paginationLinks, paginationMeta, stats } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    function checkStatus(user: any) {
        if (user.is_verified) {
            if (user.deleted_at) {
                return "ถูกระงับ";
            } else {
                return "ยืนยันแล้ว";
            }
        } else {
            return "รอยืนยัน";
        }
    }

    return (
        <div className="w-full h-[93%] flex flex-col lg:flex-row justify-center">
            <div className="w-full flex flex-col justify-between px-10 py-10 gap-4 lg:w-2/5 lg:pr-0">
                <div className="h-full flex justify-around items-center bg-white p-4 rounded-xl shadow-md animate-down ">
                    
                    <div className="p-4 rounded-full bg-[#C8C3F4]">
                        <User2 width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ลูกค้าทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalUsers }</h1>
                    </div>
                </div>
                <div className="h-full flex justify-around items-center bg-white p-4 rounded-xl shadow-md animate-down">
                    <div className="p-4 rounded-full bg-[#FC5A5A]">
                        <User2 width={24} height={24} color="#a93d3d"/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ลูกค้าที่ถูกระงับ</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalBan }</h1>
                    </div>
                </div>
                <div className="h-full flex justify-around items-center bg-white p-4 rounded-xl shadow-md animate-down">
                    <div className="p-4 rounded-full bg-[#C5FFC2]">
                        <User2 width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ลูกค้าที่ยืนยันบัญชีแล้ว</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalConfirm }</h1>
                    </div>
                </div>
                <div className="h-full flex justify-around items-center bg-white p-4 rounded-xl shadow-md animate-down">
                    <div className="p-4 rounded-full bg-[#FFE3BE]">
                        <User2 width={24} height={24} color="#8D4F00"/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ลูกค้าไม่ได้ยืนยันบัญชี</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalPending }</h1>
                    </div>
                </div>
            </div>

            <div className="w-full h-full p-10 animate-down">
                <div className="w-full h-full flex flex-col bg-white p-10 rounded-xl shadow-md gap-5">
                    <div className="w-full flex flex-col justify-between items-center lg:flex-row">
                        <h1 className="font-normal text-2xl">ลูกค้า</h1>
                        <div className="flex flex-wrap gap-4 items-center">

                            <div className="flex flex-row gap-4 items-center">
                                <Link 
                                    to={`/users?page=${paginationMeta.current_page - 1}`}
                                    className={`p-2 rounded-md transition-all duration-300 
                                        ${paginationMeta.current_page === 1 
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none" 
                                            : "bg-[#3A57E8] text-white hover:bg-[#2E46C2]"
                                        }`
                                    }
                                >
                                    ก่อนหน้า
                                </Link>

                                <p>หน้า {paginationMeta.current_page} / {paginationMeta.last_page}</p>

                                <Link 
                                    to={`/users?page=${paginationMeta.current_page + 1}`}
                                    className={`p-2 rounded-md transition-all duration-300 
                                        ${paginationMeta.current_page === paginationMeta.last_page 
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none" 
                                            : "bg-[#3A57E8] text-white hover:bg-[#2E46C2]"
                                        }`
                                    }
                                >
                                    ถัดไป
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 text-[rgb(0,0,0,0.5)] gap-4 border-b pb-2 font-semibold">
                        <h1 className="px-2 md:px-4 text-left">ชื่อลูกค้า</h1>
                        <h1 className="px-2 md:px-4 text-left hidden md:block">อีเมล</h1>
                        <h1 className="px-2 md:px-4 text-left hidden md:block">เบอร์โทร</h1>
                        <h1 className="px-2 md:px-4 text-left">สถานะ</h1>
                    </div>
                    
                    <div className="flex flex-col h-full">
                            {users.map((user: any) => (
                                <fetcher.Form key={user.id} method="post" className="odd:bg-[rgb(0,0,0,0.05)] flex flex-col transition-all duration-300 hover:bg-[rgb(0,0,0,0.1)]">
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

                                    <button name="_action" value="show" type="submit" key={user.id} className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4  min-h-22 items-center cursor-pointer">
                                        <h1 className="px-2 md:px-4 text-left truncate">{user.name}</h1>
                                        <h1 className="px-2 md:px-4 text-left truncate hidden md:block">{user.email}</h1>
                                        <h1 className="px-2 md:px-4 text-left truncate hidden md:block">{user.phone}</h1>
                                        <h1 className="px-2 md:px-4 text-left">{checkStatus(user)}</h1>
                                        <ChevronRight className="absolute right-2 md:right-4" width={20} height={20}/>
                                    </button>
                                </fetcher.Form>
                            ))}
                        <div className="flex flex-row w-full h-full justify-end items-end">
                            <h1 className="text-[rgb(0,0,0,0.5)]">
                                แสดง {paginationMeta.from} - {paginationMeta.to} จากทั้งหมด {paginationMeta.total} ลูกค้า
                            </h1>
                        </div>
                    </div>

            
                </div>
            </div>
        </div>
    )
}