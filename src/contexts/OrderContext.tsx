import { createContext, useState, ReactNode, useContext } from "react";
import { IOrder } from "../utils/interfaces/IOrder";
import { ShoppingCartContext } from "./ShoppingCartContext";
import { IAddress } from "../utils/interfaces/IAddress";
import { IShippingTypes } from "../utils/interfaces/IShippingTypes";

interface OrderContextType {
   order: IOrder | undefined;
   shipmentType: IShippingTypes | undefined;
   shipmentPrice: number;
   shipmentAddress: IAddress | undefined;
   createOrder: () => void
   saveOrder: () => void
   updateOrderTotalPrice: (price: number) => void
   setOrderShipmentType: (type: IShippingTypes) => void
   setOrderShipmentPrice: (shipmentPrice: number) => void
   setOrderShipmentAddress: (address: IAddress) => void
   setOrderTotalPrice: (price: number) => void
   saveShippingAddress: (status: boolean) => void
   resetOrder: () => void
}

interface OrderProviderProps {
   children: ReactNode;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: OrderProviderProps) => {
   const [order, setOrder] = useState<IOrder>();
   const [saveShipmentAddress, setSaveShipmentAddress] = useState(false);
   const [shipmentType, setShipmentType] = useState<IShippingTypes | undefined>(undefined);
   const [shipmentPrice, setShipmentPrice] = useState(0);
   const [shipmentAddress, setShipmentAddress] = useState<IAddress>();
   const [totalPrice, setTotalPrice] = useState(0);

   const cart = useContext(ShoppingCartContext);

   const createOrder = () => {
      const newOrder: IOrder = {
         products: cart!.cartProducts,
         address: shipmentAddress,
         shippingPrice: shipmentPrice.toString(),
         totalPrice: totalPrice.toString()
      }
      setOrder(newOrder);
   }

   //TODO: save order in database using the useApi hook
   const saveOrder = () => {
      if(saveShipmentAddress)
         console.log('Save shipment address');
   }

   const updateOrderTotalPrice = (price: number) => {
      order!.totalPrice += price;
   }

   const setOrderShipmentType = (type: IShippingTypes) => {
      setShipmentType(type);
   }

   const setOrderShipmentPrice = (shipmentPrice: number) => {
      setShipmentPrice(shipmentPrice);
   }

   const setOrderShipmentAddress = (shipmentAddress: IAddress) => {
      setShipmentAddress(shipmentAddress);
   }

   const setOrderTotalPrice = (price: number) => {
        setTotalPrice(price);
   }

   //TODO: use this on saveOrder to save the shipment address or not
   const saveShippingAddress = (status: boolean) => {
      setSaveShipmentAddress(!status);
   }

   const resetOrder = () => {
      setOrder(undefined);
      setShipmentPrice(0);
      setShipmentAddress(undefined);
      setOrderTotalPrice(0);
   }

   return (
      <OrderContext.Provider value={
         {
            order,
            shipmentType,
            shipmentPrice,
            shipmentAddress, 
            createOrder,
            saveOrder,
            updateOrderTotalPrice,
            setOrderShipmentType,
            setOrderShipmentPrice, 
            setOrderShipmentAddress,
            setOrderTotalPrice,
            saveShippingAddress,
            resetOrder
         }
      }>
         {children}
      </OrderContext.Provider>
   );
}
