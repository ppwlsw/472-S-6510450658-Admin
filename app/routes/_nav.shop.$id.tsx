import { useFetcher, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { Link, Outlet, redirect, useLoaderData } from 'react-router';
import { MapPin, Phone, Mail, Clock, Info, Calendar, CheckCircle, ChevronLeft } from 'lucide-react';

import Provider, { setDefaultStatus } from "~/provider";
import { useEffect, useRef } from 'react';
import { useAuth } from '~/utils/auth';

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        return redirect("/shops");
    }

    const shop = Provider.Provider[id];

    if (!shop) {
        return redirect("/shops");
    }


    return {
        id: id,
        shop: shop,
    };
}

export async function action({ request }: ActionFunctionArgs) {
    const { getCookie } = useAuth
    const auth = await getCookie({ request: request });
    const formData = await request.formData();
    const action = formData.get("_action") as string;
    const id = formData.get("id") as string;

    const shop = Provider.Provider[id];

    if (!shop) {
        return redirect("/shops");
    }

    if (action == "delete") {
        const res = await fetch(`${process.env.API_BASE_URL}/shops/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        });

        if (res.status == 200) {
            shop.shopfilter.deleted_at = new Date().toISOString();
            return { success: res.status == 200, delete: true };
        } else {
            return { error: res.status != 200 }
        }
    }
    if (action == "restore") {
        const res = await fetch(`${process.env.API_BASE_URL}/shops/${id}/restore`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        });

        if (res.status == 200) {
            shop.shopfilter.deleted_at = "";
            return { success: res.status == 200, restore: true };
        } else {
            return { error: res.status != 200 }
        }
    }
}

export default function DetailShop() {
    const { id, shop } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    return (
        <div className="z-10 relative max-w-full h-[90%] flex flex-col justify-center items-center mx-auto px-10 py-6 space-y-6 animate-fade-in">

            {/* Header Section */}
            <div className="w-full flex flex-row justify-between items-center mt-8">
                <div className="flex flex-row items-center gap-4">
                    <Link to="/shops" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-300 hover:bg-[rgb(0,0,0,0.01)]">
                        <ChevronLeft className="w-6 h-6 text-gray-500" />
                    </Link>
                    <h1 className="text-[rgb(0,0,0,0.5)]">
                        รายละเอียดร้านค้า
                    </h1>
                </div>
            </div>
            <div className="text-center space-y-2 my-8">
                <h1 className="text-3xl font-bold text-gray-900">{shop.shopfilter.name}</h1>
                <div className="flex items-center justify-center gap-2">
                    {!shop.shopfilter.is_verified && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            ร้านค้ายังไม่ได้ยืนยันบัญชี
                        </span>
                    )}
                    {shop.shopfilter.is_verified && !shop.shopfilter.deleted_at && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            ร้านที่ได้รับการยืนยัน
                        </span>
                    )}
                    {shop.shopfilter.is_verified && shop.shopfilter.deleted_at && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            ร้านค้าถูกระงับ
                        </span>
                    )}
                    {
                        shop.shopfilter.is_verified && !shop.shopfilter.deleted_at && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${shop.shopfilter.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                <Clock className="w-4 h-4 mr-1" />
                                {shop.shopfilter.is_open ? 'เปิดอยู่' : 'ปิดอยู่'}
                            </span>
                        )
                    }
                </div>
            </div>

            <div className="w-full grid md:grid-cols-2 gap-6">
                <div className="w-full bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
                    <div>
                        <h1 className="text-xl font-medium">ข้อมูลการติดต่อ</h1>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <p className="font-medium">ที่อยู่</p>
                                <p className="text-gray-600">{shop.shopfilter.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium">เบอร์โทรศัพท์</p>
                                <p className="text-gray-600">{shop.shopfilter.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium">อีเมล</p>
                                <p className="text-gray-600">{shop.shopfilter.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="w-full bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
                    <div >
                        <h1 className="text-xl font-medium">รายละเอียดร้าน</h1>
                    </div>
                    <div>
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-gray-500 mt-1" />
                            <p className="text-gray-600">{shop.shopfilter.description == "" ? "ไม่มีรายละเอียด" : shop.shopfilter.description}</p>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <Outlet />



                <div className="w-full flex flex-col gap-6">
                    <div className="h-fit w-full bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
                        <div>
                            <h1 className="text-xl font-medium">ข้อมูลเวลา</h1>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">สร้างเมื่อ</p>
                                    <p className="text-gray-600">{new Date(shop.shopfilter.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">อัพเดทล่าสุด</p>
                                    <p className="text-gray-600">{new Date(shop.shopfilter.updated_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                </div>
                            </div>
                            {shop.shopfilter.deleted_at && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">ลบเมื่อ</p>
                                        <p className="text-gray-600">{new Date(shop.shopfilter.deleted_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {
                        !shop.shopfilter.deleted_at && shop.shopfilter.is_verified && (
                            <div className="flex flex-row justify-end">
                                <button popoverTarget="delete-popover" className="px-3 py-2 bg-red-500 text-white rounded-lg bg-opacity-95 transition-all duration-300 hover:bg-opacity-100 hover:cursor-pointer">
                                    <h1>ระงับร้านค้า</h1>
                                </button>
                            </div>
                        )
                    }
                    {
                        shop.shopfilter.deleted_at && shop.shopfilter.is_verified && (
                            <div className="flex flex-row justify-end">
                                <button popoverTarget="restore-popover" className="px-3 py-2 bg-green-500 text-white rounded-lg bg-opacity-95 transition-all duration-300 hover:bg-opacity-100 hover:cursor-pointer">
                                    <h1>กู้คืนร้านค้า</h1>
                                </button>
                            </div>
                        )
                    }
                    <div id="delete-popover" popover="" className='top-[75%] left-[70%] transition-all animate-fade-in' style={{display: fetcher.data?.delete === true ? 'none' : ''}}>
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                            <h2 className="text-xl font-semibold mb-4">คุณต้องการระงับร้านค้านี้หรือไม่?</h2>
                            <p className="text-gray-600 mb-4">หากยืนยัน ร้านค้านี้จะถูกระงับและไม่สามารถใช้งานได้</p>
                            <div className="flex justify-center gap-4">
                                <button popoverTarget="delete-popover" popoverTargetAction="hide" className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                                    ยกเลิก
                                </button>
                                <fetcher.Form method='put'>
                                    <input type="hidden" name="id" value={id} />
                                    <button type="submit" name="_action" value="delete" popoverTarget="delete-popover" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                        ยืนยัน
                                    </button>
                                </fetcher.Form>
                            </div>
                        </div>
                    </div>
                    <div  id="restore-popover" popover="" className='top-[75%] left-[70%] transition-all animate-fade-in' style={{display: fetcher.data?.restore === true ? 'none' : ''}}>
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                            <h2 className="text-xl font-semibold mb-4">คุณต้องการกู้คืนร้านค้านี้หรือไม่?</h2>
                            <p className="text-gray-600 mb-4">หากยืนยัน ร้านค้านี้จะสามารถใช้งานได้อีกครั้ง</p>
                            <div className="flex justify-center gap-4">
                                <button popoverTarget="restore-popover" popoverTargetAction="hide" className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                                    ยกเลิก
                                </button>
                                <fetcher.Form method='put'>

                                    <input type="hidden" name="id" value={id} />
                                    <button type="submit" name="_action" value="restore" popoverTarget="restore-popover" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                        ยืนยัน
                                    </button>
                                </fetcher.Form>
                            </div>
                        </div>
                    </div>
                    {
                        fetcher.data?.error && (
                            <div className='fixed top-[10%] left-[70%] transition-all duration-300 animate-fade-in-out'>
                                <div className="bg-white text-red-500 p-6 rounded-lg shadow-lg w-[400px] text-center">
                                    <h2 className="text-xl font-semibold mb-4">เกิดข้อผิดพลาด!</h2>
                                    <p className="text-gray-600 mb-4">โปรดลองใหม่อีกครั้ง</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        fetcher.data?.success && fetcher.data?.delete && (
                            <div className='fixed top-[10%] left-[70%] transition-all duration-300 animate-fade-in-out'>
                                <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg w-[400px] text-center">
                                    <h2 className="text-xl font-semibold mb-4">ทำการระงับบัญชีร้านค้าสำเร็จ</h2>
                                    <p className="text-gray-600 mb-4">ร้านค้านี้จะถูกระงับและไม่สามารถใช้งานได้</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        fetcher.data?.success && fetcher.data?.restore && (
                            <div className='fixed top-[10%] left-[70%] transition-all duration-300 animate-fade-in-out'>
                                <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg w-[400px] text-center">
                                    <h2 className="text-xl font-semibold mb-4">ทำการกู้คืนบัญชีร้านค้าสำเร็จ</h2>
                                    <p className="text-gray-600 mb-4">ร้านค้านี้จะสามารถใช้งานได้อีกครั้ง</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}