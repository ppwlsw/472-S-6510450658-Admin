import { Ban, CalendarMinus, CalendarPlus, CalendarSync, Check, ChevronLeft, LucideClock, Mail, Phone } from "lucide-react";
import { Link, redirect, useFetcher, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import provider from "~/provider";
import { getAuthCookie } from "~/utils/cookie";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        return redirect("/shops");
    }

    const user = provider.UserProvider[id];

    if (!user) {
        return redirect("/users");
    }


    return {
        id: id,
        user: user,
    };
}

export async function action({ request }: ActionFunctionArgs) {
    const auth = await getAuthCookie({request: request});
    const formData = await request.formData();
    const action: string = formData.get("_action") as string;
    if (action === "delete") {
        const id = formData.get("id") as string;
        const res = await fetch(`${process.env.API_BASE_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        });

        if (res.status !== 200) {
            return { error: true };
        }

        provider.UserProvider[id].userfilter.deleted_at = new Date().toISOString();
        return { success: true, delete: true };
    }
    if (action === "restore") {
        const id = formData.get("id") as string;
        const res = await fetch(`${process.env.API_BASE_URL}/users/${id}/restore`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        });

        if (res.status !== 200) {
            return { error: true };
        }

        provider.UserProvider[id].userfilter.deleted_at = "";
        return { success: true, restore: true };
    }
    return { error: true };
}

export default function User() {
    const { id, user } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    function checkStatus() {
        if (user.userfilter.deleted_at && user.userfilter.is_verified) {
            return {
                status: 0,
                message: "ถูกระงับบัญชี"
            };
        }
        if (user.userfilter.is_verified) {
            return {
                status: 1,
                message: "ยืนยันตัวตนแล้ว"
            };
        }
        return {
            status: 2,
            message: "ยังไม่ยืนยันตัวตน"
        };
    }

    return (
        <div className="w-full h-[93%] flex flex-col lg:flex-row justify-center">
            <div className="lg:relative w-full h-full flex flex-col justify-center items-center gap-6">
                <div className="max-lg:pl-4 lg:absolute lg:top-0 lg:left-10 w-full flex flex-row justify-between items-center mt-8 animate-fade-in">
                    <div className="flex flex-row items-center gap-4">
                        <Link to="/users" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-300 hover:bg-[rgb(0,0,0,0.01)]">
                            <ChevronLeft className="w-6 h-6 text-gray-500" />
                        </Link>
                        <h1 className="text-[rgb(0,0,0,0.5)]">
                            รายละเอียดลูกค้า
                        </h1>
                    </div>
                </div>
                <div className="relative w-fit h-fit animate-image-slide">
                    <img src={`${user.userfilter.image_url == "" ? 'https://static.vecteezy.com/system/resources/previews/001/840/618/large_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg' : user.userfilter.image_url}`} className="object-cover h-20 w-20 sm:h-40 sm:w-40 lg:h-60 lg:w-60 xl:h-80 xl:w-80 rounded-full shadow-2xl bg-white hover:scale-105 transition-all duration-300" />
                    <div className={`absolute bottom-0 right-0 sm:bottom-1 sm:right-0.5 md:bottom-2 md:right-1 lg:bottom-4 lg:right-2 xl:bottom-6 xl:right-4 p-0 sm:p-1 md:p-2 lg:p-4 ${checkStatus().status == 0 ? "bg-red-500" : checkStatus().status == 1 ? "bg-green-500" : "bg-amber-500"} rounded-full shadow-md`}>
                        {
                            checkStatus().status == 0 ?
                            <Ban width={24} height={24} color="white" />
                            :
                            checkStatus().status == 1 ?
                            <Check width={24} height={24} color="white" />
                            :
                            <LucideClock width={24} height={24} color="white" />
                        }
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center animate-fade-in">
                    <div className={`w-3 h-3 rounded-full ${checkStatus().status == 0 ? "bg-red-500" : checkStatus().status == 1 ? "bg-green-500" : "bg-amber-500"}`}></div>
                    <div className="">
                        <h1 className={`text-xl ${checkStatus().status == 0 ? "text-red-500" : checkStatus().status == 1 ? "text-green-500" : "text-amber-500"} font-semibold`}>
                            {checkStatus().message}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-full flex flex-col justify-center items-center p-20 animate-fade-in-delay">
                <div className="w-full h-full flex flex-col items-start justify-center gap-2">
                    <h1 className="text-3xl font-semibold">
                        {user.userfilter.name}
                    </h1>
                    <h1 className="text-xl text-[rgb(0,0,0,0.5)]">
                        {user.userfilter.role == "CUSTOMER" ? "ลูกค้า" : "ลูกค้า"}
                    </h1>

                    <h1 className="mt-6 text-2xl font-medium">
                        ข้อมูลส่วนตัว
                    </h1>

                    <div className="w-full h-[0.8px] bg-gray-400 my-4"></div>

                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full flex flex-row gap-4 items-center">
                            <Mail width={24} height={24} color="#3A57E8" />
                            <p className="text-xl">
                                {user.userfilter.email}
                            </p>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                            <Phone width={24} height={24} color="#3A57E8" />
                            <p className="text-xl">
                                {user.userfilter.phone}
                            </p>
                        </div>
                    </div>

                    <h1 className="mt-6 text-2xl font-medium">
                        ข้อมูลบัญชี
                    </h1>

                    <div className="w-full h-[0.8px] bg-gray-400 my-4"></div>

                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full flex flex-row gap-4 items-center">
                            <CalendarPlus width={24} height={24} color="#3A57E8" />
                            <p className="text-xl">
                                สร้างเมื่อ 
                                <span className="ml-2 font-semibold">
                                    {new Date(user.userfilter.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </p>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                            <CalendarSync width={24} height={24} color="#3A57E8" />
                            <p className="text-xl">
                                อัพเดทล่าสุด
                                <span className="ml-2 font-semibold">
                                    {new Date(user.userfilter.updated_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </p>
                        </div>
                        {   user.userfilter.deleted_at &&
                            <div className="w-full flex flex-row gap-4">
                                <CalendarMinus width={24} height={24} color="#3A57E8" />
                                <p className="text-xl">
                                    ระงับบัญชีเมื่อ
                                    <span className="ml-2 font-semibold">
                                        {new Date(user.userfilter.deleted_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </p>
                            </div>
                        }
                    </div>

                    {
                        !user.userfilter.deleted_at && user.userfilter.is_verified && (
                            <div className="mt-6 w-full flex flex-row justify-end">
                                <button popoverTarget="delete-popover" className="px-3 py-2 bg-red-500 text-white rounded-lg bg-opacity-95 transition-all duration-300 hover:bg-opacity-100 hover:cursor-pointer">
                                    <h1>ระงับบัญชี</h1>
                                </button>
                            </div>
                        )
                    }
                    {
                        user.userfilter.deleted_at && user.userfilter.is_verified && (
                            <div className="mt-6 w-full flex flex-row justify-end">
                                <button popoverTarget="restore-popover" className="px-3 py-2 bg-green-500 text-white rounded-lg bg-opacity-95 transition-all duration-300 hover:bg-opacity-100 hover:cursor-pointer">
                                    <h1>กู้คืนบัญชี</h1>
                                </button>
                            </div>
                        )
                    }
                    <div id="delete-popover" popover="" className='top-[75%] left-[70%] transition-all animate-fade-in' style={{display: fetcher.data?.delete === true ? 'none' : ''}}>
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                            <h2 className="text-xl font-semibold mb-4">คุณต้องการระงับบัญชีนี้หรือไม่?</h2>
                            <p className="text-gray-600 mb-4">หากยืนยัน บัญชีนี้จะถูกระงับและไม่สามารถใช้งานได้</p>
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
                            <h2 className="text-xl font-semibold mb-4">คุณต้องการกู้คืนบัญชีนี้หรือไม่?</h2>
                            <p className="text-gray-600 mb-4">หากยืนยัน บัญชีนี้จะสามารถใช้งานได้อีกครั้ง</p>
                            <div className="flex justify-center gap-4">
                                <button popoverTarget="restore-popover" popoverTargetAction="hide" className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                                    ยกเลิก
                                </button>
                                <fetcher.Form method='patch'>

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
                                    <h2 className="text-xl font-semibold mb-4">ทำการระงับบัญชีสำเร็จ</h2>
                                    <p className="text-gray-600 mb-4">ลูกค้าจะถูกระงับและไม่สามารถใช้งานได้</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        fetcher.data?.success && fetcher.data?.restore && (
                            <div className='fixed top-[10%] left-[70%] transition-all duration-300 animate-fade-in-out'>
                                <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg w-[400px] text-center">
                                    <h2 className="text-xl font-semibold mb-4">ทำการกู้คืนบัญชีสำเร็จ</h2>
                                    <p className="text-gray-600 mb-4">ลูกค้าจะสามารถใช้งานได้อีกครั้ง</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}