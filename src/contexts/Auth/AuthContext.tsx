import { createContext } from 'react';
import { ResponseCustomer } from '../../utils/types/ResponseCustomer';
import { Customer } from '../../utils/types/Customer';
import { Address } from '../../utils/types/Address';
import { IUpdatePasswordRequest } from '../../utils/interfaces/request/IUpdatePasswordRequest';
import { IAddCustomerAddressRequest } from '../../utils/interfaces/request/IAddCustomerAddressRequest';
import { IUpdateCustomer } from '../../utils/interfaces/request/IUpdateCustomer';
import {IUpdateAddressRequest} from "../../utils/interfaces/request/IUpdateAddressRequest.ts";
import {ResponseAPI} from "../../utils/types/response/ResponseAPI.ts";
import {CreditCardRequest} from "../../utils/types/request/CreditCard/CreditCardRequest.ts";

export type AuthContextType = {
   user: ResponseCustomer | null;
   signin: (email: string, password: string) => Promise<ResponseAPI>;
   signout: () => void;
   verifyRole: () => Promise<ResponseAPI>;
   registerCustomer: (user: Customer) => Promise<ResponseAPI>;
   deactivateAccount: (token: string) => Promise<ResponseAPI>;
   updatePassword: (passwordUpdateRequest: IUpdatePasswordRequest) => Promise<ResponseAPI>;
   registerCustomerAddress: (address: IAddCustomerAddressRequest) => Promise<ResponseAPI>;
   updateCustomer: (customer: IUpdateCustomer) => Promise<ResponseAPI>;
   deleteCustomerAddress: (address: Address) => Promise<ResponseAPI>;
   updateCustomerAddress: (address: IUpdateAddressRequest) => Promise<ResponseAPI>;
   createCreditCard: (request: CreditCardRequest) => Promise<ResponseAPI>;
   listCreditCards:() => Promise<ResponseAPI>;
}


export const AuthContext = createContext<AuthContextType>(null!);
