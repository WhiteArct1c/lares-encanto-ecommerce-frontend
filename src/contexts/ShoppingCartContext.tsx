import { createContext, useState, ReactNode } from "react";
import { IProduct } from "../utils/interfaces/Product";
import { IProductItem } from "../utils/interfaces/ProductItem";

interface ShoppingCartContextType {
   cartProducts: IProductItem[];
   addCartProduct: (product: IProduct) => void;
   removeCartItemProduct: (productId: number) => void;
   removeCartProduct: (productId: number) => void;
}

interface ShoppingCartProviderProps {
   children: ReactNode;
}

export const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
   const [cartProducts, setCartProducts] = useState<IProductItem[]>([]);

   const addCartProduct = (product: IProduct) => {
      const productIndex = cartProducts.findIndex(p => p.product.id === product.id);

      if (productIndex !== -1) {
         const updatedCartProducts = [...cartProducts];
         updatedCartProducts[productIndex].quantity += 1;
         setCartProducts(updatedCartProducts);
      } else {
         const newCartProduct: IProductItem = {
            id: product.id,
            product: product,
            quantity: 1
         };

         setCartProducts([...cartProducts, newCartProduct]);
      }

   }

   const removeCartItemProduct = (productId: number) => {
      const productIndex = cartProducts.findIndex(p => p.product.id === productId);

      if (productIndex !== -1) {
         const updatedCartProducts = [...cartProducts];
         if (updatedCartProducts[productIndex].quantity === 1) {
            updatedCartProducts.splice(productIndex, 1);
         } else {
            updatedCartProducts[productIndex].quantity -= 1;
         }
         setCartProducts(updatedCartProducts);
      }
   };

   const removeCartProduct = (productId: number) => {
      const updatedCartProducts = cartProducts.filter(p => p.product.id !== productId);
      setCartProducts(updatedCartProducts);
   }


   return (
      <ShoppingCartContext.Provider value={{ cartProducts, addCartProduct, removeCartItemProduct, removeCartProduct }}>
         {children}
      </ShoppingCartContext.Provider>
   );
}
