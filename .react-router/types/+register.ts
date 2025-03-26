import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/logout": {};
  "/login": {};
  "/hello": {};
  "/createshop": {};
  "/dashboard": {};
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
  "/item/:id": {
    "id": string;
  };
  "/users": {};
  "/shops": {};
};