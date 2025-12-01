import { OrderProduct } from "../Order/OrderProduct.ts";

export type ExchangeItemResponse = {
    id: number;
    orderProduct: OrderProduct;
    quantity: number;
    reason: string | null;
}


