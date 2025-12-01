export type OrderCouponResponse = {
    id: number;
    couponCode: string;
    couponType: "PROMOTIONAL" | "EXCHANGE";
    amountUsed: number;
}

