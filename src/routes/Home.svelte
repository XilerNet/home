<script lang="ts">
    import api from "../utils/api";
</script>

<pre style="text-align: left">
{#await api.me()}Loading...
{:then me}{JSON.stringify(me, null, 2)}
{:catch error}{error}
{/await}
</pre>
