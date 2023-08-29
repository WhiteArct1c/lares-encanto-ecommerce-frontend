import { createContext } from 'react';
import { ResponseCustomer } from '../../utils/types/ResponseCustomer';
import { Customer } from '../../utils/types/Customer';

export type AuthContextType = {
   user: ResponseCustomer | null;
   signin: (email: string, password: string) => Promise<undefined>;
   signout: () => void;
   registerCustomer: (user: Customer) => Promise<undefined>;
   deactivateAccount: (token: string) => Promise<undefined>;
}


export const AuthContext = createContext<AuthContextType>(null!);
