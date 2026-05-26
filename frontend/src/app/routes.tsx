import { createBrowserRouter } from "react-router-dom";

import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ShippingPage } from "../pages/ShippingPage";
import { WishlistPage } from "../pages/WishlistPage";

import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "shipping", element: <ShippingPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
