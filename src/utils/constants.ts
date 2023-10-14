export const IN_PRODUCTION = import.meta.env.NODE_ENV === "production";

export const AUTH_TOKEN_LOCATION = "Xiler-Authorization-Token";

export const AUTH_API_URL = IN_PRODUCTION
  ? "https://auth-api.xiler.net"
  : "http://localhost:8000";

export const AUTH_WEB_URL = IN_PRODUCTION
  ? "https://auth.xiler.net"
  : "http://localhost:3000";

export const DOMAINS_API_URL = IN_PRODUCTION
  ? "https://domains-api.xiler.net"
  : "http://localhost:25201";

export const PAYMENT_API_URL = IN_PRODUCTION
    ? "https://pay-api.xiler.net"
    : "http://localhost:25202";

export const DOMAIN_PRICE = 0.0005;
