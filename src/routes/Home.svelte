<script lang="ts">
    import api from "../utils/api";
    import Intro from "../lib/components/home/Intro.svelte";
</script>

<Intro />

<pre style="text-align: left">
{#await api.me()}Loading...
{:then me}{JSON.stringify(me, null, 2)}
{:catch error}{error}
{/await}
</pre>
