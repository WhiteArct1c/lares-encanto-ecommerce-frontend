export type ProductEditRequest = {
    id: number;
    name: string;
    description: string;
    price: number;
    color: string;
    image: File | null;
    isActive: boolean;
    categoryId: number;
    pricingGroupId: number;
    stockQuantity: number;
    type: string;
}