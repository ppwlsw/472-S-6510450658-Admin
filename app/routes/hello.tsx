import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
    const { getCookie } = useAuth
    const auth = await getCookie({ request: request });
    return {auth: auth};
}

export default function Hello() {
    const {auth} = useLoaderData<typeof loader>();
    return (
        <div>
        <h1>Hello</h1>
        <p>This is the Hello page.</p>
        {auth.role}
        {auth.token}
        {auth.user_id}
        </div>
    );
}