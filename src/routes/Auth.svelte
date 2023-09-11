<script lang="ts">
    import {push, querystring} from "svelte-spa-router";
    import {parse} from "qs";
    import api from "../utils/api";
    import {AUTH_TOKEN_LOCATION, AUTH_WEB_URL} from "../utils/constants";

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


<p>
    Processing the authentication request...
</p>