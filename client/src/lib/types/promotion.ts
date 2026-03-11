/** Request for POST /api/promotions/validate */
export interface ValidatePromotionRequest {
  promoCode: string;
  orderTotal: number;
  shippingFee?: number;
}

/** Response from POST /api/promotions/validate (200) */
export interface ValidatePromotionResponse {
  /** Backend returns this as isValid */
  isValid?: boolean;
  /** Final discount actually applied to this order */
  discountApplied?: number;
  /** Optional: type + name for UI */
  promotionType?: "FixedAmount" | "Percentage" | string;
  promoName?: string;
  message?: string | null;
}

/** Item from GET /api/promotions/active */
export interface ActivePromotionDto {
  id: string;
  promoCode: string;
  promoName: string;
  description: string | null;
  promotionType: "FixedAmount" | "Percentage" | string;
  discountValue: number;
  maxDiscountValue: number | null;
  validTo: string;
}
