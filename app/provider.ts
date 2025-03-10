interface Shop {
    shopfilter: shopfilter;
}

interface shopfilter {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    is_verified: boolean;
    is_open: boolean;
    description: string;
    latitude: number;
    image_url: string;
    longitude: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface statusMessage {
    status: string;
    message: string;
    state: boolean;
}

interface User {
    userfilter: userfilter;
}

interface userfilter {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    is_verified: boolean;
}

let Provider: Record<string, Shop> = {};

let UserProvider: Record<string, User> = {};

let Status: Record<string, statusMessage> = {};

function setDefaultUserProvider(id: string) {
    UserProvider[id] = {
        userfilter: {
            id: id,
            name: "",
            email: "",
            phone: "",
            role: "",
            image_url: "",
            created_at: "",
            updated_at: "",
            deleted_at: "",
            is_verified: false
        }
    };
}

function setDefaultStatus(id: number) {
    Status[id.toString()] = {
        status: "none",
        message: "",
        state: false
    };
}

function setDefaultProvider(id: number) {
    Provider[id] = {
        shopfilter: {
            id: id.toString(),
            name: "SeeQ",
            address: "",
            phone: "",
            email: "",
            is_verified: false,
            is_open: false,
            description: "",
            image_url: "",
            latitude: 0,
            longitude: 0,
            created_at: "",
            updated_at: "",
            deleted_at: "",
        }
    };
  }

export default { Provider, Status, UserProvider };
export { setDefaultProvider, setDefaultStatus, setDefaultUserProvider };