import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
    const { getCookie } = useAuth
    const auth = await getCookie({ request: request });

    const res = await fetch(`${process.env.API_BASE_URL}/queues/getAllQueuesAllShops`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
        }
    });
    const data = await res.json();
    console.log(data);

    return {
        queues: data.data
    }
}

export default function DashBoardQueue(){
    const { queues } = useLoaderData<typeof loader>();

    return (
        <div className="">
            { queues.map((queue: any) => (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{queue.shop_name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{queue.queue_name}</h6>
                        <p className="card-text">Total: {queue.total}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}