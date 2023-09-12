<script lang="ts">
    import Router from "svelte-spa-router";
    import routes from "./routes";
    import Header from "./lib/components/Header.svelte";
    import Footer from "./lib/components/Footer.svelte";
</script>

<Header />
<main>
<Router {routes}/>
</main>
<Footer />

<style></style>
