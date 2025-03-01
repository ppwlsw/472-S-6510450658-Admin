import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { redirect, useFetcher } from "react-router";

interface ActionMessage {
    message: string;
    error: string;
    status: number;
  }

export async function action({ request }: { request: Request }) {
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

    if (formData.get("name") === "" || formData.get("address") === "" || formData.get("phone") === ""  || formData.get("email") === ""  || formData.get("password") === "" ) {
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

    const response = await fetch(`${process.env.BACKEND_URL}/shops`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TOKEN}`,
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
        return redirect("/shops");
    }
}

export default function CreateShop() {
    const [LeafletMap, setLeafletMap] = useState(null);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const fetcher = useFetcher<ActionMessage>();

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
        <div className="h-[93%] grid grid-cols-[1fr_1fr] items-center justify-center gap-6">
            <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-4">
                <h1 className="text-2xl font-medium">เลือกตำแหน่งบนแผนที่</h1>

                {LeafletMap ? <LeafletMap position={position} setPosition={setPosition}/> : <p>กำลังโหลดแผนที่...</p>}
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
                                <input name="address" type="text" className="p-2 border-[1px] border-[rgb(0,0,0,0.1)] rounded-md" />
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
                            {fetcher.data?.error && <h1 className="text-red-500">{fetcher.data.error}</h1>}
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
        </div>
    )
}