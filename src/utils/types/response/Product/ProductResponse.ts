import {ProductCategoryResponse} from "../ProductCategory/ProductCategoryResponse.ts";
import {PricingGroupResponse} from "../PricingGroup/PricingGroupResponse.ts";

export type ProductResponse = {
    id: number,
    name: string,
    description: string,
    price: number,
    salePrice: number,
    color: string,
    image: string,
    isActive: boolean,
    category: ProductCategoryResponse,
    pricingGroup: PricingGroupResponse,
    type: string,
    stockQuantity: number
}