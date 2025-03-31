import {createBrowserRouter, Outlet} from "react-router-dom";
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
import MyOrdersPage from "../pages/MyOrdersPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import MyCardsPage from "../pages/MyCardsPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminCustomersManagement from "../pages/AdminCustomersManagement";
import AdminProductsPage from "../pages/AdminProductsPage";
import MyCouponsPage from "../pages/MyCouponsPage";

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
         },
         {
            path: '/my-orders',
            element: <RequireAuth><MyOrdersPage /></RequireAuth>,
         },
         {
            path: '/my-cards',
            element: <RequireAuth><MyCardsPage /></RequireAuth>,
         },
         {
            path: '/my-coupons',
            element: <RequireAuth><MyCouponsPage /></RequireAuth>,
         },
         {
            path: '/admin',
            element: <RequireAuth><Outlet /></RequireAuth>, // Usando Outlet para renderizar as sub-rotas
            children: [
               {
                  path: 'dashboard',
                  element: <AdminDashboardPage />,
               },
               {
                  path: 'orders',
                  element: <AdminOrdersPage />,
               },
               {
                  path: 'users',
                  element: <AdminCustomersManagement />,
               },
               {
                  path: 'products',
                  element: <AdminProductsPage />
               }
            ],
         },
      ]
   }
]);