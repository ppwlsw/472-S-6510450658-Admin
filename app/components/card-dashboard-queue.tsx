import type { QueueProps } from "~/routes/_nav.dashboard._index";

export default function CardDashboardQueue({queue} : {queue: QueueProps}) {

    function checkStatus(status: string) {
        if (status == "waiting") {
            return "text-[#8D4F00]"
        }
        if (status == "canceled") {
            return "text-[#FC5A5A]"
        }
        if (status == "completed") {
            return "text-[#C5FFC2]"
        }
    }

    return (
        <div className="w-full hover:shadow-lg transition-all duration-300 bg-white p-4">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium">{queue.user_name} <span className="text-[rgb(0,0,0,0.6)]">({queue.user_email})</span></h1>
                    <h3 className="">{queue.name}</h3>
                    <p className="text-[rgb(0,0,0,0.5)]">{queue.description}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <h1 className="text-lg font-medium">คิวที่ {queue.queue_counter}</h1>
                    <h3 className={`${checkStatus(queue.status)}`}>{queue.status}</h3>
                    <p className="text-[rgb(0,0,0,0.5)]">{new Date(queue.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
            </div>
        </div>
    );
}