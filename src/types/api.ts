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