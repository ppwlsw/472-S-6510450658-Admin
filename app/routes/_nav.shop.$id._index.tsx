import type { LoaderFunctionArgs } from "react-router";
import { Link, redirect, useLoaderData } from "react-router";
import {useEffect, useState } from "react";

import Provider, { setDefaultStatus } from "~/provider";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        return redirect("/shops");
    }

    const shop = Provider.Provider[id];
    var status = Provider.Status[id];

    if (!status) {
        setDefaultStatus(parseInt(id));
        status = Provider.Status[id];
    }

    if (!status.state) {
        status.status = "none";
        status.message = "";
    }
    status.state = false;

    if (!shop) {
        return redirect("/shops");
    }

    return { 
        id: id,
        shop: shop,
        status: status
    };
}

interface MapClientProps {
    position: [number, number] | null;
    setPosition: (position: [number, number] | null) => void;
    className?: string;
    placeName?: string | null;
    setPlaceName?: (placeName: string) => void;
}

export default function Map() {
    const { id, shop, status } = useLoaderData<typeof loader>();
    const [LeafletMap, setLeafletMap] = useState<React.ComponentType<MapClientProps> | null>(null);
        
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
                {
                    status.status == "success" ? (
                        <div className="px-3 py-2 bg-[#DAFFD9] flex items-center justify-center rounded-md text-[#33D117]">
                            {status.message}
                        </div>
                    ) : (
                        <></>
                    )
                }
                {
                    shop.shopfilter.is_verified && !shop.shopfilter.deleted_at && (
                        <Link to={`/shop/${id}/edit`}>
                            <div className="px-3 py-2 bg-[#3A57E8] text-white rounded-lg bg-opacity-95 transition-all duration-300 hover:bg-opacity-100">
                                <h1>แก้ไข</h1>
                            </div>
                        </Link>
                    )
                }
            </div>
        </div>
        <div>
            {LeafletMap ? <LeafletMap position={[shop.shopfilter.latitude, shop.shopfilter.longitude]} setPosition={() => {}} className="h-96" /> : <p>กำลังโหลดแผนที่...</p>}
        </div>
    </div>
    );
}