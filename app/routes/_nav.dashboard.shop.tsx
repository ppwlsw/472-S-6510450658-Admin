import { Store } from "lucide-react";
import CardDashboardShop from "~/components/card-dashboard-shop";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";
import { Link, redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getAuthCookie } from "~/utils/cookie";
import provider, { setDefaultProvider } from "~/provider";
import { calculateNewShopInSevenDays, calculateStatusShopInSevenDays } from "~/utils/culculator";

export async function loader({ request }: LoaderFunctionArgs){
    const auth = await getAuthCookie({request: request});
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const name = url.searchParams.get("name")?.toString() ?? "";
    const status = url.searchParams.get("status")?.toString() ?? "";

    const res1 = await fetch(`${process.env.API_BASE_URL}/shops`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
        }
    }
    );


    const res = await fetch(`${process.env.API_BASE_URL}/shops/filter?page=${page}` + (name ? `&name=${name}` : "") + (status ? `&status=${status}` : "") , {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
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

    const ShopGraphData = calculateNewShopInSevenDays(data);
    const ShopBarGraphData = calculateStatusShopInSevenDays(data);

    return {
        shops: data,
        ShopGraphData: ShopGraphData,
        ShopBarGraphData: ShopBarGraphData,
        name: name,
        status: status,
        stats: stats
    };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action") as string;

    if (action == "show_shop") {

        const shopId = formData.get("shopId") as string;
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

        if (!shopId) { return redirect('/dashboard') };

        const shopProvider = provider.Provider[shopId];

        if (!shopProvider) {
            setDefaultProvider(Number(shopId));
        }

        provider.Provider[shopId] = {
            shopfilter: {
                id: shopId,
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

export default function DashBoardShop () {
    const { shops, ShopGraphData, ShopBarGraphData, name, status, stats } = useLoaderData<typeof loader>();


    return (
        <div className="flex flex-col justify-center">
            <div className="w-full flex flex-col gap-4  px-10 pt-10">
                {/* <h1 className="text-2xl">
                    สถานะร้านค้า
                </h1> */}
                <div className="w-full flex flex-col justify-between gap-4 xl:flex-row">
                    <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                        <div className="p-4 rounded-full bg-[#C8C3F4]">
                            <Store width={24} height={24} />
                        </div>
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าทั้งหมด</h1>
                            <h1 className="text-4xl font-medium">{stats.totalShops}</h1>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                        <div className="p-4 rounded-full bg-[#FC5A5A]">
                            <Store width={24} height={24} color="#a93d3d" />
                        </div>
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าที่ถูกระงับ</h1>
                            <h1 className="text-4xl font-medium">{stats.totalBan}</h1>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                        <div className="p-4 rounded-full bg-[#C5FFC2]">
                            <Store width={24} height={24} />
                        </div>
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ร้านค้าที่ได้รับการยืนยัน</h1>
                            <h1 className="text-4xl font-medium">{stats.totalConfirm}</h1>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                        <div className="p-4 rounded-full bg-[#FFE3BE]">
                            <Store width={24} height={24} color="#8D4F00" />
                        </div>
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ร้านค้าไม่ได้ยืนยันบัญชี</h1>
                            <h1 className="text-4xl font-medium">{stats.totalPending}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-between p-10 gap-4">
                <div className="w-full lg:w-7/12 h-fit bg-white p-10 rounded-xl shadow-md animate-fade-in flex flex-col gap-6">
                    <div className="">
                        <h1 className="text-xl font-bold mb-4">แนวโน้มจำนวนร้านค้าใหม่</h1>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={ShopGraphData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#C8C3F4" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full bg-white p-6 mb-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">จำนวนสถานะของร้านค้า</h2>
                            <p className="text-sm text-gray-500">ภายใน 7 วันล่าสุด</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ShopBarGraphData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="confirm" fill="#8884d8" name="ได้รับการยืนยัน" />
                                    <Bar dataKey="ban" fill="#FC5A5A" name="ถูกระงับ" />
                                    <Bar dataKey="pending" fill="#FF9F40" name="รอดำเนินการยืนยันบัญชี" />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>
                </div>
                <div className="h-fit w-full lg:w-5/12 bg-white flex flex-col rounded-lg shadow-lg items-center p-8 gap-4 animate-fade-in">
                    <div className="w-full flex flex-row justify-between items-center">
                        <h1 className="text-xl font-bold">
                            ร้านค้า
                        </h1>
                        <Link to="/shops" className="underline">ดูทั้งหมด</Link>
                    </div>
                    <div className="">
                        {
                            shops.slice(0, 9).map((shop: any) => (
                                <div key={shop.id}>
                                    <CardDashboardShop shop={shop} />
                                    <div className="w-full h-[0.8px] bg-[rgb(0,0,0,0.1)]"></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
 
        </div>
    )
}