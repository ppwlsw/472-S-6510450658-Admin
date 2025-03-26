import { ChevronLeft, Edit } from "lucide-react";
import { useState } from "react";
import { Link, redirect, useFetcher, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useAuth } from "~/utils/auth";
import { prefetchImage } from "~/utils/image-proxy";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { getCookie } = useAuth
    const auth = await getCookie({ request: request });
    const { id } = params;

    if (!id) {
        return redirect("/shops");
    }

    const responseApiUrl = await fetch(`${process.env.API_BASE_URL}/shops/${id}/item`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
        },
    });

    if (!responseApiUrl.ok) {
        return redirect("/shops");
    }

    const apiJson = await responseApiUrl.json();
    const api_url = apiJson.data.api_url ?? "";

    if (api_url === "") {
        return {
            id: id,
            api_url: "",
            items: []
        }
    }

    const responseItems = await fetch(`${process.env.API_BASE_URL}/shops/${id}/recommend-items`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
        },
    });

    if (!responseItems.ok) {
        return {
            id: id,
            api_url: api_url,
            items: []
        }
    }

    const itemsJson = await responseItems.json();
    const items: item[]  = itemsJson.data;

    return {
        id: id,
        api_url: api_url,
        items: items
    };
}

export async function action({ request }: ActionFunctionArgs) {
    const { getCookie } = useAuth
    const auth = await getCookie({ request: request });
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const api_url = formData.get("api_url") as string;
    const action = formData.get("_action") as string;


    if (action == "update_api") {
            const api_key = formData.get("api_key") as string;
            if (api_key !== "") {

                const responseApiUrl = await fetch(`${process.env.API_BASE_URL}/shops/${id}/item`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.token}`
                    },
                });
            
                if (!responseApiUrl.ok) {
                    return redirect("/shops");
                }
            
                const apiJson = await responseApiUrl.json();
                const api_url_test = apiJson.data.api_url ?? "";

                if (api_url_test === "") {
                    const res = await fetch(`${process.env.API_BASE_URL}/shops/${id}/item`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${auth.token}`,
                        },
                        body: JSON.stringify({
                            'api_url': api_url,
                            'api_key': api_key,
                        }),
                    });

                    if (res.ok) {
                        return redirect(`/shop/${id}`);
                    }
                }
                else {
                    const res = await fetch(`${process.env.API_BASE_URL}/shops/${id}/item`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${auth.token}`
                        },
                        body: JSON.stringify({
                            api_url: api_url,
                            api_key: api_key
                        }),
                    });
                    console.log(res);
    
                    if (res.ok) {
                        return redirect(`/shop/${id}`);
                    }
                }

            }

        return {
            id: id,
            api_url: api_url,
            item: []
        }
    }
}

export default function List() {
    const { id, api_url, items } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();
    const [editApiUrl, setEditApiUrl] = useState(false);
    const [newApiUrl, setNewApiUrl] = useState(api_url);
    const [newApiKey, setNewApiKey] = useState("");

    return (
        <div className="flex flex-col items-center px-10 py-6 animate-fade-in">
            <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                    <Link to={`/shop/${id}`} className="p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-300 hover:bg-[rgb(0,0,0,0.01)]">
                        <ChevronLeft className="w-6 h-6 text-gray-500" />
                    </Link>
                    <h1 className="text-[rgb(0,0,0,0.5)]">
                        รายการสินค้า
                    </h1>
                </div>
            </div>
            <div className="flex flex-col items-center py-6 px-10 w-full mt-10">
                <div className="flex flex-row w-full gap-4 justify-center items-center">
                    <label htmlFor="api_url" className="w-1/4">API URL ของฐานข้อมูลของรายการสินค้า:</label>
                    <input placeholder={`${api_url === "" ? "ไม่มี URL API" : ""}`} onChange={(e) => setNewApiUrl(e.target.value)} value={`${newApiUrl}`} type="text" disabled={!editApiUrl} className={`border-2 rounded-lg p-2 bg-white w-full transition-all duration-300 ${editApiUrl ? "" : "cursor-not-allowed text-[rgb(0,0,0,0.6)] border-[rgb(0,0,0,0.4)]"}`} />
                    {!editApiUrl ? (
                        <Edit height={36} width={36} className="cursor-pointer animate-fade-in" onClick={() => { setEditApiUrl(true) }} />
                    ) : <></>
                    }
                </div>
            </div>
            {
                editApiUrl ? (
                    <div className="flex flex-col items-center py-6 px-10 w-full">
                        <div className="flex flex-row w-full gap-4 justify-center items-center">
                            <label htmlFor="api_url" className="w-1/4">API KEY ของฐานข้อมูลของรายการสินค้า:</label>
                            <input onChange={(e) => setNewApiKey(e.target.value)} value={`${newApiKey}`} type="text" className={`border-2 rounded-lg p-2 bg-white w-full transition-all duration-300`} />
                        </div>
                    </div>
                ) : <></>
            }
            {
                editApiUrl ? (
                    <div className="flex flex-row gap-4 animate-fade-in">
                        <button onClick={() => { setEditApiUrl(false) }} className="bg-[#FC5A5A] text-white p-2 rounded-lg cursor-pointer">ยกเลิก</button>
                        <fetcher.Form method="POST">
                            <input type="hidden" name="id" value={id} />
                            <input type="hidden" value={newApiUrl} name="api_url" className="border-2 border-[rgb(0,0,0,0.4)] rounded-lg p-2 text-[rgb(0,0,0,0.6)] bg-white w-full" />
                            <input type="hidden" value={newApiKey} name="api_key" className="border-2 border-[rgb(0,0,0,0.4)] rounded-lg p-2 text-[rgb(0,0,0,0.6)] bg-white w-full" />
                            <button type="submit" name="_action" value="update_api" className="bg-[#3A57E8] text-white p-2 rounded-lg cursor-pointer">ยืนยัน</button>
                        </fetcher.Form>
                    </div>
                ) : <></>
            }
            <div className="flex flex-col items-center py-6 px-10 w-full mt-10">
                <h1 className="text-xl font-medium">รายการสินค้า</h1>
                <div className="w-full flex flex-col gap-4 mt-4">
                    {
                        items.map((item: item) => (
                            <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-row justify-between items-center">
                                <div className="flex flex-row gap-4 items-center">
                                    <img src={item.image_url} className="w-20 h-20 rounded-lg object-cover" />
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-lg font-medium">{item.name}</h1>
                                        <p className="text-[rgb(0,0,0,0.5)]">{item.is_available}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <h1 className="text-lg font-medium">{item.price} บาท</h1>
                                    <h1 className="text-[rgb(0,0,0,0.5)]">{item.quantity} ชิ้น</h1>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}