import { createBrowserRouter} from "react-router-dom";
import App from "../App";
import RegisterUserForm from "../pages/RegisterUserForm";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";
import CheckoutPage from "../pages/CheckoutPage";

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
         }
      ]
   }
])