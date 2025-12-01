import { OrderStatusEnum } from "../enum/OrderStatusEnum";
import { IAddress } from "./IAddress";
import { IProductItem } from "./IProductItem";

export interface IOrder {
   id?: string,
   userId?: string;
   products: IProductItem[],
   address?: IAddress,
   shippingPrice: number,
   totalPrice: number,
   status?: OrderStatusEnum
}