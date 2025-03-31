export type ProductCreateRequest = {
    name: string;
    description: string;
    price: number;
    color: string;
    image: File;
    categoryId: number;
    pricingGroupId: number;
    type: string;
    initialStockQuantity: number;
}