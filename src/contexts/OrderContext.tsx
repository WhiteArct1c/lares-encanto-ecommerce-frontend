import { createContext, useState, ReactNode, useContext } from "react";
import { IOrder } from "../utils/interfaces/IOrder";
import { ShoppingCartContext } from "./ShoppingCartContext";

interface OrderContextType {
   order: IOrder | undefined;
   createOrder: (cartTotalPrice: number) => void
   updateOrderTotalPrice: (price: number) => void
   setOrderShipmentPrice: (shipmentPrice: number) => void
}

interface OrderProviderProps {
   children: ReactNode;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: OrderProviderProps) => {
   const [order, setOrder] = useState<IOrder>();
   const [shipmentPrice, setShipmentPrice] = useState(0);

   const cart = useContext(ShoppingCartContext);

   const createOrder = (cartTotalPrice: number) => {
      const newOrder: IOrder = {
         products: cart!.cartProducts,
         shippingPrice: shipmentPrice.toString(),
         totalPrice: cartTotalPrice.toString()
      }
      setOrder(newOrder);
   }

   const updateOrderTotalPrice = (price: number) => {
      order!.totalPrice += price;
   }

   const setOrderShipmentPrice = (shipmentPrice: number) => {
      setShipmentPrice(shipmentPrice);
   }


   return (
      <OrderContext.Provider value={{order, createOrder, updateOrderTotalPrice, setOrderShipmentPrice}}>
         {children}
      </OrderContext.Provider>
   );
}
