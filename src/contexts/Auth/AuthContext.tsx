import { createContext } from 'react';
import { ResponseCustomer } from '../../utils/types/ResponseCustomer';
import { Customer } from '../../utils/types/Customer';
import { Address } from '../../utils/types/Address';
import { IUpdatePasswordRequest } from '../../utils/interfaces/request/IUpdatePasswordRequest';
import { IAddCustomerAddressRequest } from '../../utils/interfaces/request/IAddCustomerAddressRequest';
import { IUpdateCustomer } from '../../utils/interfaces/request/IUpdateCustomer';

export type AuthContextType = {
   user: ResponseCustomer | null;
   signin: (email: string, password: string) => Promise<undefined>;
   signout: () => void;
   registerCustomer: (user: Customer) => Promise<undefined>;
   deactivateAccount: (token: string) => Promise<undefined>;
   updatePassword: (passwordUpdateRequest: IUpdatePasswordRequest) => Promise<undefined>;
   registerCustomerAddress: (address: IAddCustomerAddressRequest) => Promise<undefined>;
   updateCustomer: (customer: IUpdateCustomer) => Promise<undefined>;
   deleteCustomerAddress: (address: Address) => Promise<undefined>;
}


export const AuthContext = createContext<AuthContextType>(null!);
