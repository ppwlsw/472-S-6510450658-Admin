import { Store, User } from "lucide-react";
import { Link, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import CardDashboardShop from "~/components/card-dashboard-shop";
import { getAuthCookie } from "~/services/cookie";

export async function loader({ request }: LoaderFunctionArgs) {
    const auth = await getAuthCookie({request: request});
    
    const res = await fetch(`${process.env.BACKEND_URL}/shops`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
        }
    }
    );

    const resCustomer = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
        }
    }
    );

    const jsonAllShop = await res.json();
    const jsonAllCustomer = await resCustomer.json();


    const data = jsonAllShop.data;
    const totalShops = data.length;
    const totalCustomers = jsonAllCustomer.data.length;

    return {
        shops: jsonAllShop.data,
        customers: jsonAllCustomer.data,
        totalCustomers: totalCustomers,
        totalShops: totalShops
    };
}

export default function DashBoardAll() {
    const { shops, customers, totalShops, totalCustomers } = useLoaderData<typeof loader>();

    return (
        <div className="">
            <div className="w-full flex flex-col justify-between gap-4 xl:flex-row px-10 pt-10">
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full bg-[#C8C3F4]">
                        <Store width={24} height={24} />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ร้านค้าทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">{totalShops}</h1>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white p-4 rounded-xl shadow-md gap-10 animate-fade-in">
                    <div className="p-4 rounded-full">
                        <User width={24} height={24} />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <h1 className="text-lg text-[rgb(0,0,0,0.5)]">ลูกค้าทั้งหมด</h1>
                        <h1 className="text-4xl font-medium">{totalCustomers}</h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-4 px-10 pt-10 animate-fade-in">
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full">
                            <h1 className="text-2xl">
                                ร้านค้าทั้งหมด
                            </h1>
                        </div>
                        <div className="w-full">
                            <h1 className="text-2xl">
                                ลูกค้าทั้งหมด
                            </h1>
                        </div>
                    </div>
                    <div className="w-full flex flex-row gap-4">
                        <div className="h-fit w-full bg-white flex flex-col rounded-lg shadow-lg items-center p-8 gap-4 animate-fade-in">
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
                        <div className="h-fit w-full bg-white flex flex-col rounded-lg shadow-lg items-center p-8 gap-4 animate-fade-in">
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
            </div>
        </div>
    );
}