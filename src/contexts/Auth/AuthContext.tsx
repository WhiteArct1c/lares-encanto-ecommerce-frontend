import { createContext } from 'react';
import { ResponseCustomer } from '../../utils/types/ResponseCustomer';

export type AuthContextType = {
   user: ResponseCustomer | null;
   signin: (email: string, password: string) => Promise<boolean>;
   signout: () => void;
}


export const AuthContext = createContext<AuthContextType>(null!);
