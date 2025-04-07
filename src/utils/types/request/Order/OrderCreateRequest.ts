import {IProductItem} from "../../../interfaces/IProductItem.ts";
import {IAddress} from "../../../interfaces/IAddress.ts";
import {OrderPayment} from "./OrderPayment.ts";
import {IShippingTypes} from "../../../interfaces/IShippingTypes.ts";

export type OrderCreateRequest = {
    address: IAddress;
    orderPayments: OrderPayment[];
    orderProducts: IProductItem[];
    shipping: IShippingTypes;
    type: string;
    totalPrice: number;
}