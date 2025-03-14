import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, type ActionFunctionArgs } from "react-router";
import { getAuthCookie } from "~/utils/cookie";

interface ActionMessage {
    message: string;
    error: string;
    status: number;
    success?: boolean;
}

export async function action({ request }: ActionFunctionArgs) {
    const auth = await getAuthCookie({ request: request });
    const formData = await request.formData();

    const positionRaw = formData.get("position") as string;
    if (!positionRaw || positionRaw.trim() === "") {
        return new Response(JSON.stringify({
            message: "กรุณาเลือกตำแหน่งบนแผนที่",
            error: "กรุณาเลือกตำแหน่งบนแผนที่",
            status: 400
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const positionArray = positionRaw.split(",").map((pos) => parseFloat(pos));
    if (positionArray.length !== 2 || isNaN(positionArray[0]) || isNaN(positionArray[1])) {
        return new Response(JSON.stringify({
            message: "พิกัดตำแหน่งไม่ถูกต้อง",
            error: "พิกัดตำแหน่งไม่ถูกต้อง",
            status: 400
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (formData.get("name") === "" || formData.get("address") === "" || formData.get("phone") === "" || formData.get("email") === "" || formData.get("password") === "") {
        const message: ActionMessage = {
            message: "กรุณากรอกข้อมูลให้ครบถ้วน",
            error: "กรุณากรอกข้อมูลให้ครบถ้วน",
            status: 400,
        }
        return message;
    }


    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;


    if (phone.length != 10) {
        return new Response(JSON.stringify({
            message: "เบอร์โทรศัพท์ต้องมีความยาว 10 ตัว",
            error: "เบอร์โทรศัพท์ต้องมีความยาว 10 ตัว",
            status: 400
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({
            message: "รูปแบบอีเมลไม่ถูกต้อง",
            error: "รูปแบบอีเมลไม่ถูกต้อง",
            status: 400
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (password.length < 6) {
        return new Response(JSON.stringify({
            message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัว",
            error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัว",
            status: 400
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
        return new Response(JSON.stringify({
            message: "รหัสผ่านต้องมีตัวอักษรใหญ่, ตัวอักษรเล็ก, และตัวเลขอย่างน้อยหนึ่งตัว",
            error: "รหัสผ่านต้องมีตัวอักษรใหญ่, ตัวอักษรเล็ก, และตัวเลขอย่างน้อยหนึ่งตัว",
            status: 400
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const response = await fetch(`${process.env.API_BASE_URL}/shops`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
            'name': name,
            'address': address,
            'phone': phone,
            'email': email,
            'password': password,
            'latitude': positionArray[0],
            'longitude': positionArray[1],
        }),
    });

    if (!(response.status === 201)) {
        const message: ActionMessage = {
            message: "มีอีเมลนี้อยุ่ในระบบแล้ว",
            error: "มีอีเมลนี้อยุ่ในระบบแล้ว",
            status: 500,
        }
        return message;
    }
    else {
        const message: ActionMessage = {
            message: "สร้างบัญชีร้านค้าสำเร็จ",
            error: "",
            status: 200,
            success: true,
        }
        return message;
    }
}

interface MapClientProps {
    position: [number, number] | null;
    setPosition: (position: [number, number] | null) => void;
    className?: string;
    placeName?: string | null;
    setPlaceName?: (placeName: string) => void;
}

export default function CreateShop() {
    const [LeafletMap, setLeafletMap] = useState<React.ComponentType<MapClientProps> | null>(null);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [placeName, setPlaceName] = useState<string | null>(null);

    const fetcher = useFetcher<typeof action>();

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("~/components/map")
                .then((mod) => setLeafletMap(() => mod.default))
                .catch((err) => console.error("Leaflet failed to load", err));
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative h-[93%] flex flex-col xl:flex-row items-center justify-center gap-6">
            <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-4">
                <h1 className="text-2xl font-medium">เลือกตำแหน่งบนแผนที่</h1>

                {LeafletMap ? <LeafletMap position={position} setPosition={setPosition} placeName={placeName} setPlaceName={setPlaceName} /> : <p>กำลังโหลดแผนที่...</p>}
            </div>
            <fetcher.Form method="POST" className="w-full h-full flex justify-center items-center p-10">
                <div className="relative w-full flex flex-col gap-4 p-10 bg-white rounded-xl shadow-md">
                    <h1 className="text-2xl font-medium">กรอกข้อมูลร้านค้า</h1>
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <input type="hidden" name="position" value={position ? position.join(",") : ""} />
                            <label className="flex flex-col gap-2">
                                <span>ชื่อร้านค้า</span>
                                <input name="name" type="text" className="p-2 border-[1px] border-[rgb(0,0,0,0.1)] rounded-md " />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span>ที่อยู่</span>
                                <input value={placeName ?? ""} name="address" type="text" className="p-2 border-[1px] border-[rgb(0,0,0,0.1)] rounded-md" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span>เบอร์โทรศัพท์</span>
                                <input name="phone" type="text" className="p-2 border-[1px] border-[rgb(0,0,0,0.1)] rounded-md" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span>อีเมล</span>
                                <input name="email" type="text" className="p-2 border-[1px] border-[rgb(0,0,0,0.1)] rounded-md" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span>รหัสผ่าน</span>
                                <div className="flex items-center gap-2 relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className="p-2 border-[1px] border-[rgb(0,0,0,0.1)] rounded-md w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-2.5 top-2.5"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </label>
                            {fetcher.data?.error && <h1 className="text-red-500">{fetcher.data?.error}</h1>}
                        </div>
                        <button
                            className="p-2 bg-[#3A57E8] bg-opacity-95 text-white rounded-md transform duration-300 transition-all hover:bg-opacity-100"
                            disabled={fetcher.state === "submitting"}
                            type="submit"
                        >
                            {fetcher.state === "submitting" ? "กำลังสร้างร้านค้า..." : "สร้างร้านค้า"}
                        </button>
                    </div>
                </div>
            </fetcher.Form>
            {
                fetcher.data?.error && (
                    <div className='fixed top-[10%] left-[70%] transition-all animate-fade-in-out'>
                        <div className="bg-white text-red-500 p-6 rounded-lg shadow-lg w-[400px] text-center">
                            <h2 className="text-xl font-semibold mb-4">ทำการสร้างบัญชีร้านค้าไม่สำเร็จ</h2>
                        </div>
                    </div>
                )
            }
            {
                fetcher.data?.success && (
                    <div className='fixed top-[10%] left-[70%] transition-all animate-fade-in-out'>
                        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg w-[400px] text-center">
                            <h2 className="text-xl font-semibold mb-4">ทำการสร้างบัญชีร้านค้าสำเร็จ</h2>
                        </div>
                    </div>
                )
            }
        </div>
    )
}