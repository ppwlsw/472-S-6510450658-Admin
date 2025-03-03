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
  "/dashboard/shop": {};
  "/dashboard/user": {};
  "/createshop": {};
  "/shop/:id": {
    "id": string;
  };
  "/shop/:id/edit": {
    "id": string;
  };
  "/users": {};
  "/shops": {};
};