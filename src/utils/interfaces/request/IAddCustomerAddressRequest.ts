export interface IAddCustomerAddressRequest{
   token: string,
   address:{
      title: string
      cep: string
      residenceType: string
      addressType: string
      streetName: string
      addressNumber: string
      neighborhoods: string
      city: string
      state: string
      country: string
      observations: string
   }
}