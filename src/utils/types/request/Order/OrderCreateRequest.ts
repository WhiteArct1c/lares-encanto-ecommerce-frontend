import {IProductItem} from "../../../interfaces/IProductItem.ts";
import {IAddress} from "../../../interfaces/IAddress.ts";
import {OrderPayment} from "./OrderPayment.ts";
import {OrderShippingRequest} from "./OrderShippingRequest.ts";
import {CouponUsage} from "./CouponUsage.ts";

export type OrderCreateRequest = {
    address: IAddress;
    orderPayments: OrderPayment[];
    orderProducts: IProductItem[];
    shipping: OrderShippingRequest;
    type: string;
    totalPrice: number;
    coupons?: CouponUsage[];
}