import axios from 'axios';

//TODO: desmockar para consumir API real
const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL_DEV
});

export const useApi = () => ({
   validateToken: async (token: string) =>{
      // const response = await api.post('/validate', { token });
      // return response.data;
      const response = await api.get('/users');
      const user = response.data.filter(data => data.token === token);

      if(user.length === 1){
         return user[0];
      }

      return {
         user: null,
         token:''
      };
   },
   signin: async(email: string, password: string) => {
      const response = await api.get('/users');
      const user = response.data.filter(data => data.user.email === email && data.user.password === password);

      if(user.length === 1){
         return user[0];
      }

      return {
         user:{},
         token:''
      };
   },
   logout: async() => {
      // const response = await api.post('/logout');
      // return response.data;
   },
   getProducts: async() => {
      const response = await api.get('/products');
      return response.data;
   },
   getShippingTypes: async() => {
      const response = await api.get('/shippings');
      return response.data;
   },
   getPaymentTypes: async() => {
      const response = await api.get('/paymentMethods');
      return response.data;
   }
})