import axios from 'axios';
import { Customer } from '../utils/types/Customer';
import { Address } from '../utils/types/Address';
import { IUpdatePasswordRequest } from '../utils/interfaces/request/IUpdatePasswordRequest';
import { IAddCustomerAddressRequest } from '../utils/interfaces/request/IAddCustomerAddressRequest';
import { IUpdateCustomer } from '../utils/interfaces/request/IUpdateCustomer';
import { IUpdateAddressRequest } from "../utils/interfaces/request/IUpdateAddressRequest.ts";
import { CreditCardRequest } from "../utils/types/request/CreditCard/CreditCardRequest.ts";
import {ProductResponse} from "../utils/types/response/Product/ProductResponse.ts";
import {ResponseAPI} from "../utils/types/response/ResponseAPI.ts";
import {OrderCreateRequest} from "../utils/types/request/Order/OrderCreateRequest.ts";
import {OrderCreateResponse} from "../utils/types/response/Order/OrderCreateResponse.ts";

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL_DEV,
   headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      "Content-Type": "application/json"
   }
});

const api_json = axios.create({
   baseURL: "http://localhost:3000",
   headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      "Content-Type": "application/json"
   }
});

export const useApi = () => ({
   validateToken: async (token: string) => {
      const response = await api.post('/auth/validate', token);
      return response.data;
   },
   verifyRole: async (token: string) => {
      const response = await api.post('/auth/verify-role', token);
      return response.data;
   },
   signin: async (email: string, password: string) => {
      const response = await api.post('/auth/login', {email, password});
      return response.data;
   },
   logout: async () => {
      // const response = await api.post('/logout');
      // return response.data;
   },
   deactivateAccount: async (token: string) =>{
      const response = await api.post('/auth/deactivate-account', token);
      return response.data;
   },
   deactivateUserById: async (id: number) => {
      const response = await api.put(`/user/deactivate/${id}`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   activateUserById: async (id: number) => {
      const response = await api.put(`/user/activate/${id}`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   updatePassword: async (updatePasswordRequest: IUpdatePasswordRequest) => {
      const response = await api.post('/user/update-password', updatePasswordRequest);
      return response.data;
   },
   getCustomerInfo: async (token: string) => {
        const response = await api.get('/customers/self', {
             headers:{
                Authorization: `Bearer ${token}`
             }
        });
        return response.data;
   },
   registerCustomer: async (customer: Customer) => {
      const response = await api.post('/auth/register', customer);
      return response.data;
   },
   updateCustomer: async (customer: IUpdateCustomer) => {
      const response = await api.put('/customers', customer, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      })
      return response.data;
   },
   listAllCustomers: async (page: number = 0, size: number = 10) => {
      const response = await api.get(`/customers?page=${page}&size=${size}`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   registerCustomerAddress: async (address: IAddCustomerAddressRequest) => {
      const response = await api.post('/address', address);
      return response.data;
   },
   updateCustomerAddress: async(address: IUpdateAddressRequest) => {
     const response = await api.put('/address', address);
     return response.data;
   },
   deleteCustomerAddress: async (address: Address) => {
      const response = await api.delete(`/address?id=${address.id}`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   getAvailableProducts: async (): Promise<ResponseAPI<ProductResponse>> => {
      const response = await api.get('/products/available');
      return response.data;
   },
   getAvailableProductById: async (id: number): Promise<ResponseAPI<ProductResponse>> => {
        const response = await api.get(`/products/available/${id}`);
        return response.data;
   },
   getShippingTypes: async () => {
      const response = await api_json.get('/shippings');
      return response.data;
   },
   getPaymentTypes: async () => {
      const response = await api_json.get('/paymentMethods');
      return response.data;
   },
   getCreditCardById: async (id: number) => {
      const response = await api.get(`/credit-cards/${id}`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   createCreditCard: async (createCreditCardRequest: CreditCardRequest) => {
      const response = await api.post(`/credit-cards`, createCreditCardRequest, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   updateCreditCard: async (updateCreditCardRequest: CreditCardRequest) => {
      const response = await api.put(`/credit-cards/${updateCreditCardRequest.id}`, updateCreditCardRequest, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   deleteCreditCard: async (id: number) => {
      const response = await api.delete(`/credit-cards/${id}`, {
         headers:{
             Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   listCreditCards: async() => {
      const response = await api.get(`/credit-cards`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   createOrder: async (order: OrderCreateRequest): Promise<ResponseAPI<OrderCreateResponse>> => {
        const response = await api.post('/orders', order, {
             headers:{
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
             }
        });
        return response.data;
   },
   createProduct: async (createProductRequest: FormData) => {
      const response = await api.post('/products', createProductRequest, {
         headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      })
      return response.data;
   },
   listAllProducts: async (page: number = 0, size: number = 10) => {
      const response = await api.get(`/products?page=${page}&size=${size}`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   listAllProductCategories: async() => {
      const response = await api.get(`/product-categories`, {
         headers:{
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   },
   listAllPricingGroups: async() => {
      const response = await api.get(`/pricing-groups`, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
         }
      });
      return response.data;
   }
})