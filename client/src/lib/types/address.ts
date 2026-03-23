/** Payload for POST /api/me/addresses (create address) */
export interface CreateAddressPayload {
  recipientName: string;
  recipientPhone: string;
  venue: string;
  ward: string;
  district: string;
  province: string;
  provinceId?: number | null;
  districtId?: number | null;
  wardCode?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}

/** Address returned from API */
export interface AddressDto {
  id: string;
  recipientName: string;
  recipientPhone: string;
  venue: string;
  ward: string;
  district: string;
  province: string;
  provinceId?: number | null;
  districtId?: number | null;
  wardCode?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
  createdAt?: string;
}
