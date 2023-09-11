<script lang="ts">
    import api from "../../../utils/api";
    import {push, querystring} from "svelte-spa-router";
    import {parse} from "qs";

    let query = "";
    let lastQuery = "";
    let domainSuggestions: string[] = [];
    const DOMAIN_SEARCH_REGEX = /^[a-z\d](?:[a-z\d-]{0,251}[a-z\d])?\.?o?$/;

    function isValidDomainSearch(query: string) {
        return DOMAIN_SEARCH_REGEX.test(query);
    }

    function handleQuery(queryString: string | undefined) {
        if (queryString) {
            const parsedQueryString = parse(queryString);

            async function handleDomainSuggestions() {
                if ('search' in parsedQueryString) {
                    query = parsedQueryString['search'] as string;

                    if (!isValidDomainSearch(query)) {
                        return;
                    }
                    domainSuggestions = await api.searchDomains(query);
                }
            }

            handleDomainSuggestions();
        }
    }

    function handleSubmit() {
        push(`/?search=${query}`);
    }

    $: handleQuery($querystring)
</script>


<div>
    <h3>Become a part of the future</h3>

    <h1>Decentralize. Liberate. Search.</h1>

    <form on:submit|preventDefault={handleSubmit}>
        <input placeholder="Find your .o domain here!" type="text" id="search" name="search" bind:value={query}
               required
               on:beforeinput={e => {
                   lastQuery = e.currentTarget.value;
               }}
               on:input={e => {
                   if (e.currentTarget.value === "") {
                        return;
                   }

                   query = e.currentTarget.value.toLowerCase();
                   if (!isValidDomainSearch(e.currentTarget.value)) {
                       e.currentTarget.value = lastQuery;
                   }
               }}
        >
        <button type="submit">Search</button>
    </form>

    <ul>
        {#each domainSuggestions as domainSuggestion}
            <li> {domainSuggestion} </li>
        {/each}
    </ul>
</div>