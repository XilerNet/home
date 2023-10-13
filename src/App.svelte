<script lang="ts">
    import Router from "svelte-spa-router";
    import routes from "./routes";
    import Header from "./lib/components/Header.svelte";
    import Footer from "./lib/components/Footer.svelte";
    import api from "./utils/api";

    $: isSignedIn = api.isSignedIn;
</script>

<Header />
<main class:signed-in={$isSignedIn}>
<Router {routes}/>
</main>
<Footer />

<style></style>
