import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useApi } from "../../hooks/useApi";
import { ResponseCustomer } from "../../utils/types/ResponseCustomer";

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
   }, [api])

   const signin = async (email: string, password: string) => {
      const data = await api.signin(email, password);

      if (data.code == "200 OK") {
         const userData = await api.validateToken(data.data[0].token);
         setUser(userData.data[0]);
         setToken(data.data[0].token);
         return true;
      }

      return false;
   }

   const signout = async () => {
      await api.logout();
      setUser(null);
      setToken('');
   }

   const setToken = (token: string) => {
      localStorage.setItem('authToken', token);
   }

   return (
      <AuthContext.Provider value={{ user, signin, signout }}>
         {children}
      </AuthContext.Provider>
   )
}