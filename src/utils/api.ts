import type {ErrorResponse, MeResponse, RefreshTokenResponse} from "../types/api";
import {AUTH_API_URL, AUTH_TOKEN_LOCATION} from "./constants";
import {writable} from "svelte/store";


class Api {
    public isSignedIn = writable(false);

    async refreshToken(token: string): Promise<string> {
        const {token: newToken} = await this.request<RefreshTokenResponse>(AUTH_API_URL, "/refresh", "POST", null, {
            'Authorization': `Bearer ${token}`
        });
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

    private async request<T>(base_url: string, path: string, method: string, body?: any, headers?: HeadersInit): Promise<T> {
        const defaultHeaders = {
            'Content-Type': 'application/json'
        }

        const res = await fetch(`${base_url}${path}`, {
            method, headers: {...defaultHeaders, ...headers}, body: JSON.stringify(body)
        });

        let json: T | ErrorResponse;
        let text = await res.text();

        if (text) {
            try {
                json = JSON.parse(text);
            } catch (e) {
                throw new Error(text);
            }
        }

        if (!(res.status >= 200 && res.status < 300)) {
            throw new Error((json! as ErrorResponse).message);
        }

        return json! as T;
    }

    private async requestAuth<T>(path: string, method: string, bearer?: boolean, body?: any): Promise<T> {
        const headers: HeadersInit = bearer ? {
            'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_LOCATION)}`
        } : {};

        return this.request<T>(AUTH_API_URL, path, method, body, headers);
    }
}

export default new Api();