import { Link, redirect, useFetcher, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useEffect, useState } from "react";

import Provider from "~/provider";
import { useAuth } from "~/utils/auth";

interface MapClientProps {
    position: [number, number] | null;
    setPosition: (position: [number, number] | null) => void;
    className?: string;
}


export async function loader({ request, params }: LoaderFunctionArgs) {
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
        shop: shop
    };
}

export async function action({ request }: ActionFunctionArgs) {
    const { getCookie } = useAuth
    const auth = await getCookie({ request: request });
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const address = formData.get("address");
    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");
    const shop = Provider.Provider[id];
    const status = Provider.Status[id];

    if (id !== "" || latitude !== "" || longitude !== "") {
        const res = await fetch(`${process.env.API_BASE_URL}/shops/${id}/location`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                address: address
            }),
        });
        
        console.log(res);
    
        status.status = "success";
        status.message = "อัปเดตพิกัดร้านสำเร็จ";
    
        shop.shopfilter.latitude = parseFloat(latitude as string);
        shop.shopfilter.longitude = parseFloat(longitude as string);
        shop.shopfilter.address = address as string;
    }else{
        status.status = "error";
        status.message = "อัปเดตพิกัดร้านไม่สำเร็จ";
    }
    
    status.state = true;
    return redirect(`/shop/${id}`);
}

interface MapClientProps {
    position: [number, number] | null;
    setPosition: (position: [number, number] | null) => void;
    className?: string;
    placeName?: string | null;
    setPlaceName?: (placeName: string) => void;
}

export default function EditShop() {
    const { id, shop } = useLoaderData<typeof loader>();
    const [LeafletMap, setLeafletMap] = useState<React.ComponentType<MapClientProps> | null>(null);
    const [position, setPosition] = useState<[number, number] | null>([shop.shopfilter.latitude,shop.shopfilter.longitude]);
    const fetcher = useFetcher<typeof action>();
    const [placeName, setPlaceName] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
          import("~/components/map")
            .then((mod) => setLeafletMap(() => mod.default))
            .catch((err) => console.error("Leaflet failed to load", err));
        }
      }, []);
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-[1px] border-[rgb(0,0,0,0.1)] space-y-6">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-xl font-medium">พิกัดร้าน</h1>
                <div className="flex flex-row gap-4">
                    <Link to={`/shop/${id}`}>
                        <div className="px-3 py-2 bg-red-500 text-white rounded-lg bg-opacity-95 transition-all duration-300 hover:bg-opacity-100">
                            <h1>ยกเลิก</h1>
                        </div>
                    </Link>
                    <fetcher.Form method="post">
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="address" value={placeName ?? ""}/>
                        <input type="hidden" name="latitude" value={position?.[0] ?? ""} />
                        <input type="hidden" name="longitude" value={position?.[1] ?? ""} />
                        <button type="submit" className="px-3 py-2 bg-green-500 text-white rounded-lg bg-opacity-95 transition-all duration-300 hover:bg-opacity-100">
                            <h1>ยืนยัน</h1>
                        </button>
                    </fetcher.Form>
                </div>
            </div>
            <div>
                {placeName}
                {LeafletMap ? <LeafletMap position={position} setPosition={setPosition} placeName={placeName} setPlaceName={setPlaceName} className="h-96" /> : <p>กำลังโหลดแผนที่...</p>}
            </div>

        </div>
    );
}