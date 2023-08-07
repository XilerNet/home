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