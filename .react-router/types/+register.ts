import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/createshop": {};
  "/dashboard": {};
  "/dashboard/queue": {};
  "/dashboard/shop": {};
  "/dashboard/user": {};
  "/shop/:id": {
    "id": string;
  };
  "/shop/:id/edit": {
    "id": string;
  };
  "/users": {};
  "/shops": {};
};