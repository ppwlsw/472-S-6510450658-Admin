import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData, useParams } from "@remix-run/react";
import { MapPin, Phone, Mail, Clock, Info, Calendar, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { FC, useEffect, useState } from "react";

import Provider from "~/provider.server";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        return redirect("/shops");
    }

    const shop = Provider[id];

    if (!shop) {
        return redirect("/shops");
    }

    console.log(shop);

    return { shop };
}

export default function DetailShop() {
    const { shop } = useLoaderData<typeof loader>();
    const [LeafletMap, setLeafletMap] = useState<FC | null>(null);
    
    useEffect(() => {
          import("~/components/map").then((mod) => setLeafletMap(() => mod.default));
        }, []);

    return (
        <div className="max-w-4xl h-[90%] flex flex-col justify-center items-center mx-auto p-6 space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="w-full flex flex-row items-center mt-8 gap-4">
                <div onClick={() => window.history.back()} className="p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-300 hover:bg-[rgb(0,0,0,0.01)]">
                    <ChevronLeft className="w-6 h-6 text-gray-500" />
                </div>
                <h1 className="text-[rgb(0,0,0,0.5)]">
                    รายละเอียดร้านค้า
                </h1>
            </div>
            <div className="text-center space-y-2 my-8">
                <h1 className="text-3xl font-bold text-gray-900">{shop.shopfilter.name}</h1>
                <div className="flex items-center justify-center gap-2">
                    {shop.shopfilter.is_verified && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            ร้านที่ได้รับการยืนยัน
                        </span>
                    )}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${shop.shopfilter.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {shop.shopfilter.is_open ? 'เปิดอยู่' : 'ปิดอยู่'}
                    </span>
                </div>
            </div>

            <div className="w-full grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
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
                <div className="bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
                    <div >
                        <h1 className="text-xl font-medium">รายละเอียดร้าน</h1>
                    </div>
                    <div>
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-gray-500 mt-1" />
                            <p className="text-gray-600">{shop.shopfilter.description}</p>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
                    <div>
                        <h1 className="text-xl font-medium">พิกัดร้าน</h1>
                    </div>
                    <div>
                        {LeafletMap ? <LeafletMap position={[shop.shopfilter.latitude, shop.shopfilter.longitude]} className="h-96" /> : <p>กำลังโหลดแผนที่...</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
                    <div>
                        <h1 className="text-xl font-medium">ข้อมูลเวลา</h1>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium">สร้างเมื่อ</p>
                                <p className="text-gray-600">{shop.shopfilter.created_at}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium">อัพเดทล่าสุด</p>
                                <p className="text-gray-600">{shop.shopfilter.updated_at}</p>
                            </div>
                        </div>
                        {shop.shopfilter.deleted_at && (
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">ลบเมื่อ</p>
                                    <p className="text-gray-600">{shop.shopfilter.deleted_at}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}