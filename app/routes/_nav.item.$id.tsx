import { ChevronLeft, Edit } from "lucide-react";
import { useState } from "react";
import { Link, redirect, useFetcher, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useAuth } from "~/utils/auth";

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
    const token = apiJson.data.token ?? "";

    return {
        id: id,
        api_url: api_url,
        token: token
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
        const res = await fetch(`${process.env.API_BASE_URL}/shops/${id}/item`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_url: api_url
            }),
        });
    }

    return {
        item: ""
    }
}

export default function List() {
    const { id, api_url, token } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();
    const [editApiUrl, setEditApiUrl] = useState(false);
    const [newApiUrl, setNewApiUrl] = useState(api_url);

    const [editApiToken, setEditApiToken] = useState(false);
    const [newApiToken, setNewApiToken] = useState(token);    

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
                    <input onChange={(e) => setNewApiUrl(e.target.value)} value={`${editApiUrl ? newApiUrl : api_url}`} type="text" disabled={!editApiUrl} className={`border-2 rounded-lg p-2 bg-white w-full transition-all duration-300 ${editApiUrl ? "" : "cursor-not-allowed text-[rgb(0,0,0,0.6)] border-[rgb(0,0,0,0.4)]"}`} />
                    {!editApiUrl ? (
                        <Edit height={36} width={36} className="cursor-pointer animate-fade-in" onClick={() => { setEditApiUrl(true) }} />
                    ) : <></>
                    }
                    {
                        editApiUrl ? (
                            <div className="flex flex-row gap-4 animate-fade-in">
                                <button onClick={() => { setEditApiUrl(false) }} className="bg-[#FC5A5A] text-white p-2 rounded-lg cursor-pointer">ยกเลิก</button>
                                <fetcher.Form method="POST">
                                    <input type="hidden" name="id" value={id} />
                                    <input type="hidden" value={newApiUrl} name="api_url" className="border-2 border-[rgb(0,0,0,0.4)] rounded-lg p-2 text-[rgb(0,0,0,0.6)] bg-white w-full" />
                                    <button type="submit" name="_action" value="update_api" className="bg-[#3A57E8] text-white p-2 rounded-lg cursor-pointer">ยืนยัน</button>
                                </fetcher.Form>
                            </div>
                        ) : <></>
                    }
                </div>
            </div>
            <div className="flex flex-col items-center py-6 px-10 w-full">
                <div className="flex flex-row w-full gap-4 justify-center items-center">
                    <label htmlFor="api_url" className="w-1/4">API TOKEN ของฐานข้อมูลของรายการสินค้า:</label>
                    <input onChange={(e) => setNewApiToken(e.target.value)} value={`${editApiToken ? newApiToken : token}`} type="text" disabled={!editApiToken} className={`border-2 rounded-lg p-2 bg-white w-full transition-all duration-300 ${editApiToken ? "" : "cursor-not-allowed text-[rgb(0,0,0,0.6)] border-[rgb(0,0,0,0.4)]"}`} />
                    {!editApiToken ? (
                        <Edit height={36} width={36} className="cursor-pointer animate-fade-in" onClick={() => { setEditApiToken(true) }} />
                    ) : <></>
                    }
                    {
                        editApiToken ? (
                            <div className="flex flex-row gap-4 animate-fade-in">
                                <button onClick={() => { setEditApiToken(false) }} className="bg-[#FC5A5A] text-white p-2 rounded-lg cursor-pointer">ยกเลิก</button>
                                <fetcher.Form method="POST">
                                    <input type="hidden" name="id" value={id} />
                                    <input type="hidden" value={newApiToken} name="api_token" className="border-2 border-[rgb(0,0,0,0.4)] rounded-lg p-2 text-[rgb(0,0,0,0.6)] bg-white w-full" />
                                    <button type="submit" name="_action" value="update_token" className="bg-[#3A57E8] text-white p-2 rounded-lg cursor-pointer">ยืนยัน</button>
                                </fetcher.Form>
                            </div>
                        ) : <></>
                    }
                </div>
            </div>
        </div>
    );
}