import { createContext } from 'react';
import { User } from '../../utils/types/User';

export type AuthContextType = {
   user: User | null;
   signin: (email: string, password: string) => Promise<boolean>;
   signout: () => void; 
}


export const AuthContext = createContext<AuthContextType>(null!);
