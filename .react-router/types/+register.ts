import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/login": {};
  "/hello": {};
  "/createshop": {};
  "/dashboard": {};
  "/dashboard/queue": {};
  "/dashboard/shop": {};
  "/dashboard/user": {};
  "/user/:id": {
    "id": string;
  };
  "/shop/:id": {
    "id": string;
  };
  "/shop/:id/edit": {
    "id": string;
  };
  "/users": {};
  "/shops": {};
};