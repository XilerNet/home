import type {
    Domain, DomainOrderItem, DomainOrderResponse,
    DomainsResponse,
    ErrorResponse,
    MeResponse, OwnedDomain, OwnedDomainsResponse, PaymentStatusResponse, PricingResponse,
    RefreshTokenResponse,
} from "../types/api";
import {
    AUTH_API_URL,
    AUTH_TOKEN_LOCATION,
    DOMAINS_API_URL, PAYMENT_API_URL,
} from "./constants";
import {writable} from "svelte/store";
import {toast} from "@zerodevx/svelte-toast";

class Api {
    public isSignedIn = writable(false);

    async refreshToken(token: string): Promise<string> {
        const {token: newToken} = await this.request<RefreshTokenResponse>(
            AUTH_API_URL,
            "/refresh",
            "POST",
            null,
            {
                Authorization: `Bearer ${token}`,
            },
        );
        return newToken;
    }

    async me(): Promise<MeResponse> {
        // TODO: Implement caching
        return this.requestAuth<MeResponse>("/me", "GET", true);
    }

    async logout(): Promise<void> {
        return this.requestAuth<void>("/logout", "POST", true);
    }

    async initSignedIn(): Promise<boolean> {
        try {
            await this.me();
            this.isSignedIn.set(true);
            return true;
        } catch (e) {
            return false;
        }
    }

    async searchDomains(query: string): Promise<string[]> {
        return this.requestDomains<string[]>(
            `/search?query=${query}`,
            "GET",
            false,
        );
    }

    async getAddresses(): Promise<string[]> {
        return this.requestAuth<string[]>("/addresses", "GET", true);
    }

    async getDomainsForAddresses(addresses: string[]): Promise<Domain[]> {
        return this.requestDomains<DomainsResponse>(
            "/domains",
            "POST",
            false,
            {addresses},
        ).then(domains => domains.domains);
    }

    async getOwnedDomains(): Promise<OwnedDomain[]> {
        return this.requestPay<OwnedDomainsResponse>(
            "/domains",
            "GET",
            true,
        ).then(domains => domains.domains);
    }

    async getDomains(): Promise<Domain[]> {
        const addresses = await this.getAddresses();
        return this.getDomainsForAddresses(addresses);
    }

    async createDomainOrder(domains: DomainOrderItem[]): Promise<DomainOrderResponse> {
        return this.requestPay<DomainOrderResponse>(
            "/new",
            "POST",
            true,
            {domains},
        );
    }

    async getOrderStatus(id: string): Promise<PaymentStatusResponse> {
        return this.requestPay<PaymentStatusResponse>(
            `/status/${id}`,
            "GET",
            true,
        );
    }

    async deletePayment(id: string): Promise<void> {
        return this.requestPay<void>(
            `/delete/${id}`,
            "DELETE",
            true,
        );
    }

    async getPricing(domainCount: number): Promise<PricingResponse> {
        return this.requestPay<PricingResponse>(
            `/pricing?amount=${domainCount}`,
            "GET",
            true,
        );
    }

    private async request<T>(
        base_url: string,
        path: string,
        method: string,
        body?: any,
        headers?: HeadersInit,
    ): Promise<T> {
        const defaultHeaders = {
            "Content-Type": "application/json",
        };

        let res: Response;
        let text: string;

        try {
            res = await fetch(`${base_url}${path}`, {
                method,
                headers: {...defaultHeaders, ...headers},
                body: JSON.stringify(body),
            });
            text = await res.text();
        } catch (e) {
            toast.push("Network error, please make sure you are connected to the internet. If this keeps happening, contact a system administrator. (https://dc.xiler.net)", {
                theme: {
                    '--toastWidth': '80dvw',
                    '--toastBackground': '#F56565',
                    '--toastProgressBackground': '#C53030',
                    '--toastProgressFill': '#fff',
                    '--toastColor': '#fff',
                },
            });
            console.error(`Network error: ${e}`);
            throw new Error(`Network error: ${e}`);
        }

        let json: T | ErrorResponse;

        if (text) {
            try {
                json = JSON.parse(text);
            } catch (e) {
                json = {message: text};
            }
        }

        if (!(res.status >= 200 && res.status < 300)) {
            let message = (json! as ErrorResponse).message;
            toast.push(message, {
                theme: {
                    '--toastWidth': '80dvw',
                    '--toastBackground': '#F56565',
                    '--toastProgressBackground': '#C53030',
                    '--toastProgressFill': '#fff',
                    '--toastColor': '#fff',
                },
            });
            console.error(message);
            throw new Error(message);
        }

        return json! as T;
    }

    private async requestWithHeader<T>(
        url: string,
        path: string,
        method: string,
        bearer?: boolean,
        body?: any,
    ): Promise<T> {
        const headers: HeadersInit = bearer
            ? {
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_LOCATION)}`,
            }
            : {};

        return this.request<T>(url, path, method, body, headers);
    }

    private async requestAuth<T>(
        path: string,
        method: string,
        bearer?: boolean,
        body?: any,
    ): Promise<T> {
        return this.requestWithHeader<T>(AUTH_API_URL, path, method, bearer, body);
    }

    private async requestPay<T>(
        path: string,
        method: string,
        bearer?: boolean,
        body?: any,
    ): Promise<T> {
        return this.requestWithHeader<T>(PAYMENT_API_URL, path, method, bearer, body);
    }

    private async requestDomains<T>(
        path: string,
        method: string,
        bearer?: boolean,
        body?: any,
    ): Promise<T> {
        return this.requestWithHeader<T>(DOMAINS_API_URL, path, method, bearer, body);
    }
}

export default new Api();
