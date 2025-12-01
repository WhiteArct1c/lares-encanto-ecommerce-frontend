export type CouponCreateRequest = {
    code: string;
    value: number;
    expiresAt: string | null;
    couponType: "PROMOTIONAL";
}

