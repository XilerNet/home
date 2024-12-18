export interface RefreshTokenResponse {
    token: string;
}

export interface ErrorResponse {
    message: string;
}

export interface MeResponse {
    id: string;
    email: string;
    contact_email: string;
    addresses: string[];
    created_at: string;
    updated_at: string;
}


export interface Domain {
    domain: string,
    inscription: string,
}

export interface DomainsResponse {
    domains: Domain[];
}

export interface DomainOrderItem {
    domain: string,
    target: string,
}

export interface DomainOrderResponse {
    id: string,
    address: string,
    amount: number,
}

export interface PaymentStatusResponse {
    id: string,
    account_id: string,
    address: string,
    amount: number,
    received: number,
    initiated: boolean,
    completed: boolean,
    created_at: string,
    updated_at: string,
}

export interface OwnedDomain {
    domain: string,
    payment_completed: boolean,
    reveal_tx: string | null,
}

export interface OwnedDomainsResponse {
    domains: OwnedDomain[],
}

export interface StackableLoyaltyDiscount {
    message: string,
    amount: number,
    currency: string,
}

export interface PricingResponse {
    stackable_loyalty_discounts: StackableLoyaltyDiscount[],
    non_stackable_loyalty_discounts: string[],
    non_stackable_loyalty_discount: number,
    non_stackable_loyalty_discount_currency: string,
    final_price: number,
}

export interface GetPrivateKeyResponse {
    private_key: string,
}