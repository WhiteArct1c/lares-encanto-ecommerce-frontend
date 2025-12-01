import {ProductResponse} from "../types/response/Product/ProductResponse.ts";

export interface IProductItem {
   id: number;
   product: ProductResponse,
   quantity: number
}