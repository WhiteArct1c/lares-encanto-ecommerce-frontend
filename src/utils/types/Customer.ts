export type Customer ={
   user:{
      email: string,
      password: string,
      confirmedPassword: string
  },
  fullName: string,
  cpf: string,
  birthDate: string,
  phone: string,
  gender: string,
  address:{
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
  }
}