import {IAddress} from "../../../interfaces/IAddress.ts";
import {IProductItem} from "../../../interfaces/IProductItem.ts";

export type ShippingCalculationRequest = {
    address: IAddress;
    products: IProductItem[];
}
