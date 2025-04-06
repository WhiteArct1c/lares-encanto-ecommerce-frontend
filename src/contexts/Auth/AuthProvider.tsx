import {useEffect, useState} from "react";
import {AuthContext} from "./AuthContext";
import {useApi} from "../../hooks/useApi";
import {ResponseCustomer} from "../../utils/types/ResponseCustomer";
import {Customer} from "../../utils/types/Customer";
import {Address} from "../../utils/types/Address";
import {IUpdatePasswordRequest} from "../../utils/interfaces/request/IUpdatePasswordRequest";
import {IAddCustomerAddressRequest} from "../../utils/interfaces/request/IAddCustomerAddressRequest";
import {IUpdateCustomer} from "../../utils/interfaces/request/IUpdateCustomer";
import {IUpdateAddressRequest} from "../../utils/interfaces/request/IUpdateAddressRequest.ts";
import {CreditCardRequest} from "../../utils/types/request/CreditCard/CreditCardRequest.ts";
import {ResponseAPI} from "../../utils/types/response/ResponseAPI.ts";
import {OK} from "../../utils/types/apiCodes.ts";
import {User} from "../../utils/types/User.ts";

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
   }, []);

   const signin = async (email: string, password: string) => {
      const data: ResponseAPI<User> = await api.signin(email, password);

      if (data.data && data.code === OK) {
         const userData = await api.validateToken(data.data[0].token);
         setUser(userData.data[0]);
         setToken(data.data[0].token);
      }

      return data;
   }

   const verifyRole = async () => {
      const token = localStorage.getItem('authToken');
      if(token){
         return await api.verifyRole(token);
      }
   }

   const signout = async () => {
      await api.logout();
      setUser(null);
      setToken('');
   }

   const registerCustomer = async (user: Customer) => {
      return await api.registerCustomer(user);
   }

   const deactivateAccount = async (token: string) => {
      return await api.deactivateAccount(token);
   }

   const updatePassword = async (passwordUpdateRequest: IUpdatePasswordRequest) => {
      return await api.updatePassword(passwordUpdateRequest);
   }

   const updateCustomer = async (customer: IUpdateCustomer) => {
      return await api.updateCustomer(customer);
   }

   const registerCustomerAddress = async (address: IAddCustomerAddressRequest) => {
      return await api.registerCustomerAddress(address);
   }
   const updateCustomerAddress = async(address: IUpdateAddressRequest) => {
      return await api.updateCustomerAddress(address);
   }

   const deleteCustomerAddress = async (address: Address) => {
      return await api.deleteCustomerAddress(address);
   }

   const createCreditCard = async (createCreditCardRequest: CreditCardRequest) => {
      return await api.createCreditCard(createCreditCardRequest);
   }

   const listCreditCards = async () =>{
      const response = await api.listCreditCards();
      if (user && response.data.length > 0) {
         user.creditCards = response.data;
      }
      return response;
   }

   const setToken = (token: string) => {
      localStorage.setItem('authToken', token);
   }

   return (
      <AuthContext.Provider value={{ 
         user, 
         signin, 
         signout,
         verifyRole,
         registerCustomer, 
         deactivateAccount, 
         deleteCustomerAddress, 
         updatePassword, 
         registerCustomerAddress,
         updateCustomerAddress,
         updateCustomer,
         createCreditCard,
         listCreditCards
      }}>
         {children}
      </AuthContext.Provider>
   )
}