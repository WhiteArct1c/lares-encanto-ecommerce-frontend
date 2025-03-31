import {CreditCardRequest} from "./request/CreditCard/CreditCardRequest.ts";

export type ResponseCustomer = {
   id: number,
   fullName: string,
   cpf: string,
   birthDate: string,
   phone: string,
   gender: {
      id: string,
      name: string
   },
   ranking: string,
   userRole: string,
   isActive: string,
   addresses: [{
      id: string,
      title: string,
      cep: string,
      residenceType: string,
      addressType: string,
      categories: string[],
      streetName: string,
      addressNumber: string,
      neighborhoods: string,
      state: string,
      city: string,
      country: string,
      observations: string
   }],
   creditCards:CreditCardRequest[]
}