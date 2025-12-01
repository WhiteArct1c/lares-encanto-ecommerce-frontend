import {ProductCategoryResponse} from "../ProductCategory/ProductCategoryResponse.ts";
import {PricingGroupResponse} from "../PricingGroup/PricingGroupResponse.ts";
import {ColorResponse} from "../Color/ColorResponse.ts";
import {TagResponse} from "../Tag/TagResponse.ts";

export type ProductResponse = {
    id: number,
    name: string,
    description: string,
    price: number,
    salePrice: number,
    color: string, // ⚠️ DEPRECATED (manter compatibilidade)
    colors?: ColorResponse[], // ✅ NOVO
    tags?: TagResponse[], // ✅ NOVO
    image: string,
    isActive: boolean,
    category: ProductCategoryResponse,
    pricingGroup: PricingGroupResponse,
    type: string,
    stockQuantity: number,
    weightKg: number | null
}