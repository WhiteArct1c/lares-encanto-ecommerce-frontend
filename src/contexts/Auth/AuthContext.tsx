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
import {User} from "../../utils/types/User.ts";

export type AuthContextType = {
   user: ResponseCustomer | null;
   signin: (email: string, password: string) => Promise<ResponseAPI<User>>;
   signout: () => void;
   verifyRole: () => Promise<ResponseAPI<string>>;
   registerCustomer: (user: Customer) => Promise<ResponseAPI<never>>;
   deactivateAccount: (token: string) => Promise<ResponseAPI<never>>;
   updatePassword: (passwordUpdateRequest: IUpdatePasswordRequest) => Promise<ResponseAPI<never>>;
   registerCustomerAddress: (address: IAddCustomerAddressRequest) => Promise<ResponseAPI<never>>;
   updateCustomer: (customer: IUpdateCustomer) => Promise<ResponseAPI<IUpdateCustomer>>;
   deleteCustomerAddress: (address: Address) => Promise<ResponseAPI<never>>;
   updateCustomerAddress: (address: IUpdateAddressRequest) => Promise<ResponseAPI<never>>;
   createCreditCard: (request: CreditCardRequest) => Promise<ResponseAPI<never>>;
   listCreditCards:() => Promise<ResponseAPI<CreditCardRequest>>;
}


export const AuthContext = createContext<AuthContextType>(null!);
