import {IShippingTypes} from "../../utils/interfaces/IShippingTypes.ts";
import {IAddress} from "../../utils/interfaces/IAddress.ts";
import {IProductItem} from "../../utils/interfaces/IProductItem.ts";
import {createContext} from "react";
import {OrderCreateRequest} from "../../utils/types/request/Order/OrderCreateRequest.ts";

export type OrderContextType = {
   order: OrderCreateRequest | undefined;
   products: IProductItem[];
   shippingType: IShippingTypes | undefined;
   shippingPrice: number;
   shippingAddress: IAddress | undefined;
   createOrder: (cartProducts: IProductItem[], initialPrice: number) => void
   saveOrder: () => void
   updateOrderTotalPrice: (price: number) => void
   setOrderProducts: (products: IProductItem[]) => void
   setOrderShippingType: (type: IShippingTypes) => void
   setOrderShippingPrice: (shipmentPrice: number) => void
   setOrderShippingAddress: (address: IAddress) => void
   saveShippingAddress: (status: boolean) => void
   resetOrder: () => void
}

export const OrderContext = createContext<OrderContextType>(null!);