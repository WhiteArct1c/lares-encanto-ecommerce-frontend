import {IShippingTypes} from "../../utils/interfaces/IShippingTypes.ts";
import {IAddress} from "../../utils/interfaces/IAddress.ts";
import {IProductItem} from "../../utils/interfaces/IProductItem.ts";
import {createContext} from "react";
import {OrderCreateRequest} from "../../utils/types/request/Order/OrderCreateRequest.ts";
import {OrderPayment} from "../../utils/types/request/Order/OrderPayment.ts";
import {ResponseAPI} from "../../utils/types/response/ResponseAPI.ts";
import {OrderCreateResponse} from "../../utils/types/response/Order/OrderCreateResponse.ts";

export type OrderContextType = {
   order: OrderCreateRequest | undefined;
   products: IProductItem[];
   shippingType: IShippingTypes | undefined;
   shippingPrice: number;
   shippingAddress: IAddress | undefined;
   orderPayments: OrderPayment[];
   orderType: string;
   orderTotalPrice: number;
   createOrder: (productsOverride?: IProductItem[]) => Promise<ResponseAPI<OrderCreateResponse> | undefined>;
   addOrderPayment: (payment: OrderPayment, isMultiples: boolean) => void
   updateOrderTotalPrice: (price: number) => void
   setOrderProducts: (products: IProductItem[]) => void
   setOrderShippingType: (type: IShippingTypes) => void
   setOrderShippingPrice: (shipmentPrice: number) => void
   setOrderShippingAddress: (address: IAddress) => void
   saveShippingAddress: (status: boolean) => void
   resetOrder: () => void
}

export const OrderContext = createContext<OrderContextType>(null!);