import { OrderStatus } from "../Order/OrderStatus.ts";
import { ExchangeItemResponse } from "./ExchangeItemResponse.ts";

export type ExchangeResponse = {
    id: number;
    orderId: number;
    items: ExchangeItemResponse[];
    status: OrderStatus;
    returnToStock?: boolean;
    couponGenerated: boolean;
    createdAt: string;
    updatedAt?: string;
}
