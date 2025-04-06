import {IProductItem} from "../../../interfaces/IProductItem.ts";
import {IAddress} from "../../../interfaces/IAddress.ts";

export type OrderCreateRequest = {
    products: IProductItem[];
    shipping:{
        name: string;
        price: number;
    }
    address: IAddress;
    payments:{
        installments: number;
        method: string;
        value: number;
    }[];
    totalPrice: number;
}