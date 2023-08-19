import { createBrowserRouter} from "react-router-dom";
import RegisterUserForm from "../pages/RegisterUserForm";
import ProductsPage from "../pages/ProductsPage";
import App from "../App";

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
         }
      ]
   }
])