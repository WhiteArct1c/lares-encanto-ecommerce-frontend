export type ResponseCustomer = {
   fullName: string,
   cpf: string,
   birthDate: string,
   phone: string,
   gender: {
      id: string,
      name: string
   }
   addresses: [{
      title: string,
      cep: string,
      residenceType: string,
      addressType: string,
      streetName: string,
      addressNumber: string,
      neighborhoods: string,
      state: string,
      city: string,
      country: string,
      observations: string
   }]
}