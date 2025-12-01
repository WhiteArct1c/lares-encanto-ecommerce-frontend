import { ExchangeItemRequest } from "./ExchangeItemRequest.ts";

export type ExchangeCreateRequest = {
    orderId: number;
    items: ExchangeItemRequest[];
}


