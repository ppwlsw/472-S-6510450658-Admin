import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getAuthCookie } from "~/utils/cookie";

export async function loader({ request }: LoaderFunctionArgs) {
    const auth = await getAuthCookie({ request: request });
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