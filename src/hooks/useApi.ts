import axios from 'axios';
import { Customer } from '../utils/types/Customer';

//TODO: desmockar para consumir API real
const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL_DEV
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