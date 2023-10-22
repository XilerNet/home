<script lang="ts">
    import {push, querystring} from "svelte-spa-router";
    import {parse} from "qs";
    import api from "../utils/api";
    import {AUTH_API_URL, AUTH_TOKEN_LOCATION, AUTH_WEB_URL, DOMAINS_API_URL} from "../utils/constants";

    const parsedQueryString = $querystring ? parse($querystring) : {};
    let token = "none";

    async function handleRefreshToken() {
        if ('refresh' in parsedQueryString) {
            token = parsedQueryString['refresh'] as string;
            let newToken = await api.refreshToken(token);

            localStorage.setItem(AUTH_TOKEN_LOCATION, newToken);
            api.initSignedIn().then();
            await push('/')
        } else {
            window.location.href = AUTH_WEB_URL;
        }
    }

    handleRefreshToken();
</script>

<svelte:head>
    <title>Xiler Network | Processing Authentication</title>

    <link rel="preconnect" href="{AUTH_API_URL}">
</svelte:head>

<p>
    Processing the authentication request...
</p>