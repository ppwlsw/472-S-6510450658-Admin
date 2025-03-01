import { type LoaderFunctionArgs } from "react-router";
import { Link, redirect, useFetcher, useLoaderData } from "react-router";
import { Store, ChevronRight, PlusCircle } from "lucide-react";
import Provider, { setDefaultProvider } from "~/provider";

export async function loader({ request }: LoaderFunctionArgs){
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const name = url.searchParams.get("name")?.toString() ?? "";
    const status = url.searchParams.get("status")?.toString() ?? "";
    
    const res1 = await fetch(`${process.env.BACKEND_URL}/shops`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TOKEN}`
        }
    }
    );


    const res = await fetch(`${process.env.BACKEND_URL}/shops/filter?page=${page}` + (name ? `&name=${name}` : "") + (status ? `&status=${status}` : "") , {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TOKEN}`
        }
    }
    );

    const jsonAlldata = await res1.json();
    const jsonData = await res.json();

    const data = jsonAlldata.data;
    const totalShops = data.length;
    const totalBan = data.filter((shop: any) => shop.is_verified === true && shop.deleted_at != null).length;
    const totalConfirm = data.filter((shop: any) => shop.is_verified === true && shop.deleted_at == null).length;
    const totalPending = data.filter((shop: any) => shop.is_verified === false).length;

    const stats = {
        totalShops: totalShops,
        totalBan: totalBan,
        totalConfirm: totalConfirm,
        totalPending: totalPending
    }

    return {
        shops: jsonData.data,
        paginationLinks: jsonData.links,
        paginationMeta: jsonData.meta,
        name: name,
        status: status,
        stats: stats
    };
}

export async function action({ request }: { request: Request }) {
    
    const formData = await request.formData();

    if (formData.get("_action") === "search") {
        const name = formData.get("name") as string;
        const status = formData.get("status") as string;

        return redirect("/shops?page=1" + (name ? `&name=${name}` : "") + (status ? `&status=${status}` : ""));
    }

    if (formData.get("_action") === "show") {
        const shopId = formData.get("shopId");

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const phone = formData.get("phone") as string;
        const is_verified = formData.get("is_verified");
        const image_url = formData.get("image_url") as string;
        const is_open = formData.get("is_open") ? true : false;
        const latitude = Number(formData.get("latitude")) as number;
        const longitude = Number(formData.get("longitude")) as number;
        const description = formData.get("description") as string;
        const created_at = formData.get("created_at");
        const updated_at = formData.get("updated_at");
        const deleted_at = formData.get("deleted_at");

        const shopIdStr = shopId?.toString();
        if (!shopIdStr) return redirect("/shops");
        
        const shop = Provider.Provider[shopIdStr];
        if (!shop) {
            setDefaultProvider(Number(shopId));
        }

        Provider.Provider[shopIdStr] = {
            shopfilter: {
                id: shopIdStr,
                name: name,
                email: email,
                address: address,
                phone: phone,
                is_verified: is_verified === "true",
                image_url: image_url,
                is_open: is_open,
                latitude: latitude,
                description: description,
                longitude: longitude,
                created_at: created_at?.toString() ?? "",
                updated_at: updated_at?.toString() ?? "",
                deleted_at: deleted_at?.toString() ?? ""
            }
        };

        return redirect(`/shop/${shopId}`);
    }
}

export default function AllShop(){
    const { shops, paginationLinks, paginationMeta, name, status, stats } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    return (
        <div className="w-full h-[93%] flex flex-col justify-center">
            <div className="w-full flex flex-col justify-between px-10 pt-10 gap-4 xl:flex-row">
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#C8C3F4]">
                        <Store width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalShops }</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#FC5A5A]">
                        <Store width={24} height={24} color="#a93d3d"/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าที่ถูกระงับ</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalBan }</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#C5FFC2]">
                        <Store width={24} height={24}/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ร้านค้าที่ได้รับการยืนยัน</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalConfirm }</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#FFE3BE]">
                        <Store width={24} height={24} color="#8D4F00"/>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ร้านค้าไม่ได้ยืนยันบัญชี</h1>
                        <h1 className="text-4xl font-medium">{ stats.totalPending }</h1>
                    </div>
                </div>
            </div>

            <div className="w-full h-full p-10 ">
                <div className="w-full h-full flex flex-col bg-white p-10 rounded-xl shadow-md gap-5 animate-fade-in">
                    <div className="w-full flex flex-col justify-between items-center lg:flex-row">
                        <h1 className="font-normal text-2xl">ร้านค้า</h1>
                        <div className="flex flex-wrap gap-4 items-center">
                            <fetcher.Form method="POST" className="flex flex-row gap-4 items-center">
                                <input name="name" type="text" placeholder="ชื่อร้านค้า" className="border border-[rgb(0,0,0,0.1)] rounded-md p-2"/>
                                
                                <button name="_action" value="search" type="submit" className="bg-[#3A57E8] text-white p-2 rounded-md hover:bg-[#2E46C2] transition-all duration-300">
                                    ค้นหา
                                </button>
                                <h1 className="text-[rgb(0,0,0,0.5)]">
                                    กรองตาม:
                                </h1>
                                <select name="status" className="border border-[rgb(0,0,0,0.1)] rounded-md p-2">
                                    <option value="">ทั้งหมด</option>
                                    <option value="confirm">ยืนยันแล้ว</option>
                                    <option value="ban">ระงับบัญชี</option>
                                    <option value="pending">ยังไม่ยืนยันบัญชี</option>
                                </select>
                            </fetcher.Form>

                            <div className="flex flex-row gap-4 items-center">
                                <Link 
                                    to={`/shops?page=${paginationMeta.current_page - 1}${name ? `&name=${name}` : ""}${status ? `&status=${status}` : ""}`}
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
                                    to={`/shops?page=${paginationMeta.current_page + 1}${name ? `&name=${name}` : ""}${status ? `&status=${status}` : ""}`}
                                    className={`p-2 rounded-md transition-all duration-300 
                                        ${paginationMeta.current_page === paginationMeta.last_page 
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none" 
                                            : "bg-[#3A57E8] text-white hover:bg-[#2E46C2]"
                                        }`
                                    }
                                >
                                    ถัดไป
                                </Link>

                                <Link to="/createshop" className="">
                                    <div className="flex items-center gap-2 bg-[#3A57E8] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#2E46C2] transition-all duration-300">
                                        <PlusCircle width={24} height={24}/>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 text-[rgb(0,0,0,0.5)] gap-4 border-b pb-2 font-semibold">
                        <h1 className="px-2 md:px-4 text-left">ชื่อร้านค้า</h1>
                        <h1 className="px-2 md:px-4 text-left hidden md:block">อีเมล</h1>
                        <h1 className="px-2 md:px-4 text-left hidden md:block">เบอร์โทร</h1>
                        <h1 className="px-2 md:px-4 text-left hidden md:block">ที่อยู่</h1>
                        <h1 className="px-2 md:px-4 text-left">สถานะ</h1>
                    </div>
                    
                    <div className="flex flex-col h-full">
                            {shops.map((shop: any) => (
                                <fetcher.Form key={shop.id} method="post" className="odd:bg-[rgb(0,0,0,0.05)] flex flex-col transition-all duration-300 hover:bg-[rgb(0,0,0,0.1)] cursor-pointer">
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

                                    <button name="_action" value="show" type="submit" key={shop.id} className="relative grid grid-cols-2 md:grid-cols-5 gap-4  min-h-16 items-center ">
                                        <h1 className="px-2 md:px-4 text-left truncate">{shop.name}</h1>
                                        <h1 className="px-2 md:px-4 text-left truncate hidden md:block">{shop.email}</h1>
                                        <h1 className="px-2 md:px-4 text-left truncate hidden md:block">{shop.phone}</h1>
                                        <h1 className="px-2 md:px-4 text-left truncate hidden md:block">{shop.address}</h1>
                                        <h1 className="px-2 md:px-4 text-left">{shop.is_verified ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}</h1>
                                        <ChevronRight className="absolute right-2 md:right-4" width={20} height={20}/>
                                    </button>
                                </fetcher.Form>
                            ))}
                        <div className="flex flex-row w-full h-full justify-end items-end">
                            <h1 className="text-[rgb(0,0,0,0.5)]">
                                แสดง {paginationMeta.from} - {paginationMeta.to} จากทั้งหมด {paginationMeta.total} ร้านค้า
                            </h1>
                        </div>
                    </div>

            
                </div>
            </div>
        </div>
    )
}