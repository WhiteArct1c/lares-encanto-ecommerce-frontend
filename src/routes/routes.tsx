import { createBrowserRouter} from "react-router-dom";
import RegisterUserForm from "../pages/RegisterUserForm";
import ProductsPage from "../pages/ProductsPage";
import App from "../App";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";

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
         }
      ]
   }
])