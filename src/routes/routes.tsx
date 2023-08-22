import { createBrowserRouter} from "react-router-dom";
import App from "../App";
import RegisterUserForm from "../pages/RegisterUserPage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderFinishiedPage from "../pages/OrderFinishedPage";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App/>,
      children:[
         {
            path: "/register-user",
            element: <RegisterUserForm/>
         },
         {
            path: "/products",
            element: <ProductsPage/>
         },
         {
            path: "/products/:id",
            element: <ProductDetailsPage/>
         },
         {
            path: '/cart',
            element: <ShoppingCartPage/>
         },
         {
            path: '/checkout',
            element: <CheckoutPage/>
         },
         {
            path:'/order-finished',
            element:<OrderFinishiedPage/>,
         },
         {
            path:'/login',
            element:<LoginPage/>,
         }
      ]
   }
])