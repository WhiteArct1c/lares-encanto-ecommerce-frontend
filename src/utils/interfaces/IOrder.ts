import { OrderStatusEnum } from "../enum/OrderStatusEnum";
import { IAddress } from "./IAddress";
import { IProductItem } from "./IProductItem";

export interface IOrder {
   id?: string,
   userId?: string;
   products: IProductItem[],
   address?: IAddress,
   shippingPrice: string,
   totalPrice: string,
   status?: OrderStatusEnum,
   createdAt?: Date | null,
}