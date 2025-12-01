export type CouponResponse = {
    id: number;
    code: string;
    value: number;
    usedValue: number;
    availableValue: number;
    isActive: boolean;
    expiresAt: string;
    customerId: number;
    couponType: string;
}


