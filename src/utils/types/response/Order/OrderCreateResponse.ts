import {ProductResponse} from "../Product/ProductResponse.ts";
import {IShippingTypes} from "../../../interfaces/IShippingTypes.ts";
import {OrderPayment} from "../../request/Order/OrderPayment.ts";
import {IAddress} from "../../../interfaces/IAddress.ts";

export type OrderCreateResponse = {
    id: number;
    userId: number;
    totalPrice: number;
    payments: OrderPayment[];
    status: string;
    products: ProductResponse[];
    shipping: IShippingTypes;
    address: IAddress;
    createdAt: string;
    updatedAt: string;
}