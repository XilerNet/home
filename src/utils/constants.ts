export const IN_PRODUCTION = import.meta.env.NODE_ENV === 'production';

export const AUTH_TOKEN_LOCATION = "Xiler-Authorization-Token";
export const AUTH_API_URL = IN_PRODUCTION ? 'https://auth-api.xiler.net' : 'http://localhost:8000';
export const AUTH_WEB_URL = IN_PRODUCTION ? 'https://auth.xiler.net' : 'http://localhost:3000';
