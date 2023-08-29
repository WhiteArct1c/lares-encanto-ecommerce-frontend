import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterUserForm from "../pages/RegisterUserPage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderFinishiedPage from "../pages/OrderFinishedPage";
import LoginPage from "../pages/LoginPage";
import { RequireAuth } from "../contexts/Auth/RequireAuth";
import MyProfilePage from "../pages/MyProfilePage";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            path: "/register-user",
            element: <RegisterUserForm />
         },
         {
            path: '/login',
            element: <LoginPage />,
         },
         {
            path: "/products",
            element: <ProductsPage />
         },
         {
            path: "/products/:id",
            element: <ProductDetailsPage />
         },
         {
            path: '/cart',
            element: <ShoppingCartPage />
         },
         {
            path: '/checkout',
            element: <RequireAuth><CheckoutPage /></RequireAuth>
         },
         {
            path: '/order-finished',
            element: <RequireAuth><OrderFinishiedPage /></RequireAuth>,
         },
         {
            path: '/my-profile',
            element: <RequireAuth><MyProfilePage /></RequireAuth>,
         }
      ]
   }
])