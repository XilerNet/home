<script lang="ts">
    import api from "../utils/api";
    import {AUTH_WEB_URL} from "../utils/constants";

    const logout = async () => {
        await api.logout();
        console.log("Logged out")
        window.location.reload();
        console.log("Reloaded")
    }

    const login = async () => {
        window.location.href = AUTH_WEB_URL;
    }
</script>

<pre style="text-align: left">
{#await api.me()}
    Loading...
{:then me}
        {JSON.stringify(me, null, 2)}
{:catch error}
    {error}
{/await}
</pre>

{#await api.isSignedIn()}
    <button on:click={login}>Login</button>
{:then isSignedIn}
    {#if isSignedIn}
        <button on:click={logout}>Logout </button>
    {:else}
        <button on:click={login}>Login</button>
    {/if}
{/await}