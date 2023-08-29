import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useApi } from "../../hooks/useApi";
import { ResponseCustomer } from "../../utils/types/ResponseCustomer";
import { Customer } from "../../utils/types/Customer";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {

   const [user, setUser] = useState<ResponseCustomer | null>(null);
   const api = useApi();

   useEffect(() => {
      const validateToken = async () => {
         const storageData = localStorage.getItem('authToken');
         if (storageData) {
            const data = await api.validateToken(storageData);
            if (data.data[0]) {
               setUser(data.data[0]);
            }
         }
      }
      validateToken();
   }, [])

   const signin = async (email: string, password: string) => {
      const data = await api.signin(email, password);

      if (data.code == "200 OK") {
         const userData = await api.validateToken(data.data[0].token);
         setUser(userData.data[0]);
         setToken(data.data[0].token);
      }

      return data;
   }

   const signout = async () => {
      await api.logout();
      setUser(null);
      setToken('');
   }

   const registerCustomer = async (user: Customer) => {
      const response = await api.registerCustomer(user);
      return response;
   }

   const deactivateAccount = async (token: string) => {
      const response = await api.deactivateAccount(token);
      return response;
   }

   const setToken = (token: string) => {
      localStorage.setItem('authToken', token);
   }

   return (
      <AuthContext.Provider value={{ user, signin, signout, registerCustomer, deactivateAccount}}>
         {children}
      </AuthContext.Provider>
   )
}