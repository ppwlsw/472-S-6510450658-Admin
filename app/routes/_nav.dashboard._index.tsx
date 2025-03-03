import { Store, User } from "lucide-react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
    const res = await fetch(`${process.env.BACKEND_URL}/shops`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TOKEN}`,
        }
    }
    );

    const resCustomer = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TOKEN}`,
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
        </div>
    );
}