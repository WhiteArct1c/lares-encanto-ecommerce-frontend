import {ProductResponse} from "../Product/ProductResponse.ts";

export type OrderProduct = {
    id: number,
    quantity: number,
    product: ProductResponse;
}