<script lang="ts">
    import api from "../utils/api";
    import Intro from "../lib/components/home/Intro.svelte";
    import Empower from "../lib/components/home/Empower.svelte";
    import TryItOut from "../lib/components/home/TryItOut.svelte";
</script>

<Intro />
<Empower />
<TryItOut />

<pre style="text-align: left">
{#await api.me()}Loading...
{:then me}{JSON.stringify(me, null, 2)}
{:catch error}{error}
{/await}
</pre>
