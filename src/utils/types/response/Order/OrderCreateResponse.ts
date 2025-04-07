import {IShippingTypes} from "../../../interfaces/IShippingTypes.ts";
import {OrderPayment} from "../../request/Order/OrderPayment.ts";
import {IAddress} from "../../../interfaces/IAddress.ts";
import {ResponseCustomer} from "../../ResponseCustomer.ts";
import {OrderStatus} from "./OrderStatus.ts";
import {OrderProduct} from "./OrderProduct.ts";

export type OrderCreateResponse = {
    id: number;
    customer: ResponseCustomer;
    totalPrice: number;
    orderPayments: OrderPayment[];
    status: OrderStatus;
    orderProducts: OrderProduct[];
    shipping: IShippingTypes;
    address: IAddress;
    createdAt: string;
    updatedAt: string;
}