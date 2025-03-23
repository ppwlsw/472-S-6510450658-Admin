import { Link } from "react-router";

interface LogoutModalProps {
    isPoping: boolean,
    setIsPoping: (isPoping: boolean) => void,
}

export function LogoutModal({ isPoping, setIsPoping }: LogoutModalProps) {
  return (
    <div className="flex flex-col justify-end h-full w-full gap-6">
      {isPoping && (
        <div className="flex flex-col justify-center items-center w-full z-50 text-obsidian gap-3 p-3 shadow-xl rounded-lg transition-all duration-300 border-[1px] border-gray-200">
          <p>ต้องการออกจากระบบใช่ไหม</p>
          <div className="w-full flex flex-rol justify-evenly items-center">
            <button
              className="bg-white-smoke text-obsidian border-[1px] p-1 rounded-md active:bg-gray-400 active:text-white-smoke active:scale-105 duration-300"
              onClick={() => {
                setIsPoping(false);
              }}
            >
              ยกเลิก
            </button>
            <Link
              to={"/logout"}
              className="bg-red-600 text-white-smoke border-[1px] p-1 rounded-md hover:bg-white-smoke hover:text-red-600 hover:scale-105 duration-300"
            >
              ยืนยัน
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
