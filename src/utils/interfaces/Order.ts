import { OrderStatusEnum } from "../enum/OrderStatusEnum";
import { IProductItem } from "./ProductItem";

export interface IOrder{
   id?: string,
   userId?: string;
   products: IProductItem[],
   shippingPrice: string,
   totalPrice: string,
   status?: OrderStatusEnum,
   createdAt?:  Date | null,
}