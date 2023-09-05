import axios from 'axios';
import { Customer } from '../utils/types/Customer';
import { Address } from '../utils/types/Address';
import { IUpdatePasswordRequest } from '../utils/interfaces/request/IUpdatePasswordRequest';
import { IAddCustomerAddressRequest } from '../utils/interfaces/request/IAddCustomerAddressRequest';
import { IUpdateCustomer } from '../utils/interfaces/request/IUpdateCustomer';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL_DEV,
   headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
   }
});

export const useApi = () => ({
   validateToken: async (token: string) => {
      const response = await api.post('/auth/validate', token);
      return response.data;
   },
   signin: async (email: string, password: string) => {
      let res;

      await api.post('/auth/login', { email, password })
         .then(response => {
            res = response.data
         })
         .catch(e => {
            res = e.response.data
         });

      return res;
   },
   logout: async () => {
      // const response = await api.post('/logout');
      // return response.data;
   },
   deactivateAccount: async (token: string) =>{
      const response = await api.post('/auth/deactivate-account', token);
      return response.data;
   },
   updatePassword: async (updatePasswordRequest: IUpdatePasswordRequest) => {
      const response = await api.post('/user/update-password', updatePasswordRequest);
      return response.data;
   },
   registerCustomer: async (customer: Customer) => {
      let res;

      await api.post('/auth/register', customer)
      .then((response)=>{
         res = response.data
      })
      .catch(e => {
         res = e.response.data
      });

      return res;
   },
   updateCustomer: async (customer: IUpdateCustomer) => {
      const response = await api.put('/customers', customer)
      return response.data;
   },
   registerCustomerAddress: async (address: IAddCustomerAddressRequest) => {
      const response = await api.post('/address', address);
      return response.data;
   },
   deleteCustomerAddress: async (address: Address) => {
      const response = await api.delete(`/address?id=${address.id}`);
      return response.data;
   },
   getProducts: async () => {
      const response = await api.get('/products');
      return response.data;
   },
   getShippingTypes: async () => {
      const response = await api.get('/shippings');
      return response.data;
   },
   getPaymentTypes: async () => {
      const response = await api.get('/paymentMethods');
      return response.data;
   }
})