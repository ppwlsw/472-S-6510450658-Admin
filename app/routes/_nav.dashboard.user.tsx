import { Link, redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "~/utils/auth";
import CardDashboardUser from "~/components/card-dashboard-user";
import provider, { setDefaultProvider } from "~/provider";
import { calculateNewCustomerInSevenDays } from "~/utils/culculator";

export async function loader({ request }: LoaderFunctionArgs) {
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

    const jsonAlldata = await res1.json();

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

    const customerGraphData = calculateNewCustomerInSevenDays(data);

    return {
        customers: data,
        stats: stats,
        customerGraphData: customerGraphData
    };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action") as string;

    if (action == "show_user") {
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

        const shop = provider.Provider[userIdStr];
        if (!shop) {
            setDefaultProvider(Number(userId));
        }

        provider.UserProvider[userIdStr] = {
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

export default function DashBoardUser() {
    const { customers, stats, customerGraphData } = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-col justify-center">
            <div className="w-full flex flex-col justify-between px-10 pt-10 gap-4 xl:flex-row">
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-down">
                    <div className="p-4 rounded-full bg-[#C8C3F4]">
                        <User width={24} height={24} />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ลูกค้าทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">{stats.totalUsers}</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-down">
                    <div className="p-4 rounded-full bg-[#FC5A5A]">
                        <User width={24} height={24} color="#a93d3d" />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ลูกค้าที่ถูกระงับ</h1>
                        <h1 className="text-4xl font-medium">{stats.totalBan}</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-down">
                    <div className="p-4 rounded-full bg-[#C5FFC2]">
                        <User width={24} height={24} />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ลูกค้าที่ยืนยันบัญชีแล้ว</h1>
                        <h1 className="text-4xl font-medium">{stats.totalConfirm}</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-down">
                    <div className="p-4 rounded-full bg-[#FFE3BE]">
                        <User width={24} height={24} color="#8D4F00" />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)] text-nowrap">ลูกค้าไม่ได้ยืนยันบัญชี</h1>
                        <h1 className="text-4xl font-medium">{stats.totalPending}</h1>
                    </div>
                </div>
            </div>
            <div className="h-[540px] w-full flex flex-row justify-between p-10 gap-4">
                <div className="h-full w-full bg-white flex flex-col rounded-lg shadow-md items-center p-8 gap-4 overflow-y-scroll animate-fade-in">
                    <div className="w-full flex flex-row justify-between items-center px-2">
                        <h1 className="text-xl font-bold">
                            ลูกค้า
                        </h1>
                        <Link to="/users" className="underline">ดูทั้งหมด</Link>
                    </div>
                    {
                        customers.map((customer: any) =>
                            <div key={customer.id} className="w-full">
                                <CardDashboardUser user={customer} />
                                <div className="w-full h-[0.8px] bg-[rgb(0,0,0,0.1)]"></div>
                            </div>
                        )
                    }
                </div>
                <div className="w-full h-full bg-white p-10 rounded-xl shadow-md animate-fade-in flex flex-col gap-6">
                    <div className="mb-4 flex flex-col gap-2">
                        <h1 className="text-2xl font-medium">แนวโน้มจำนวนลูกค้าใหม่</h1>
                        <p className="text-sm text-gray-500">ภายใน 7 วันล่าสุด</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={customerGraphData}>
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