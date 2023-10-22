<script lang="ts">
    import Intro from "../lib/components/home/Intro.svelte";
    import Empower from "../lib/components/home/Empower.svelte";
    import TryItOut from "../lib/components/home/TryItOut.svelte";
    import {DOMAINS_API_URL} from "../utils/constants";

    const title = "Bitcoin Ordinals Decentralised Domains";
    const description = "Discover the future of DNS with our decentralized domain system on Bitcoin Ordinals. Take control, ensure security, and explore domain trading.";
</script>

<svelte:head>
    <title>Xiler Network | {title}</title>

    <meta name="description" content="{description}">

    <link rel="preconnect" href="{DOMAINS_API_URL}">
</svelte:head>

<Intro />
<Empower />
<TryItOut />