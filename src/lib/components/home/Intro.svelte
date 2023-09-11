<script lang="ts">
    import api from "../../../utils/api";
    import {push, querystring} from "svelte-spa-router";
    import {parse} from "qs";

    let query = "";
    let lastQuery = "";
    let domainSuggestions: string[] = [];
    const DOMAIN_SEARCH_REGEX = /^[a-z\d](?:[a-z\d-]{0,251}[a-z\d])?\.?o?$/;

    function getDomainName(query: string) {
        return query.endsWith(".o") ? query : query + ".o";
    }

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
                    let suggestions = await api.searchDomains(query);
                    suggestions = suggestions.sort((a, b) => a.length - b.length);
                    domainSuggestions = suggestions;
                }
            }

            handleDomainSuggestions();
        } else {
            domainSuggestions = [];
            query = "";
        }
    }

    function handleSubmit() {
        push(`/?search=${query}`);
    }

    $: handleQuery($querystring)
</script>


<div id="intro">
    <div class="title">
        <h3>Become a part of the future</h3>
        <h1>Decentralize. Liberate. Search.</h1>
    </div>

    <div class="search-wrapper">
        <form class="search" on:submit|preventDefault={handleSubmit}>
            <input
                    placeholder="Find your .o domain here!"
                    type="text"
                    id="search"
                    name="search"
                    required
                    bind:value={query}
                    on:beforeinput={e => {
                   lastQuery = e.currentTarget.value;
                }}
                    on:input={e => {
                   domainSuggestions = [];
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

        {#if domainSuggestions.length > 0}
            <ul class="results">
                {#if !domainSuggestions.includes(getDomainName(query))}
                    <li class="taken">
                        <p class="name">{getDomainName(query)}</p>
                        <div>
                            <p>taken</p>
                        </div>
                    </li>

                {/if}

                {#each domainSuggestions as domainSuggestion}
                    <li>
                        <p class="name">{domainSuggestion}</p>
                        <div>
                            <p>0.0005 BTC</p>
                            <!-- TODO: Add domain to cart -->
                            <button>Add to cart</button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

    <ul class="guarantees">
        <li>
            <img src="/media/check.svg" alt="checkmark">
            <p>Fully Secure</p>
        </li>
        <li>
            <img src="/media/check.svg" alt="checkmark">
            <p>24/7 Support</p>
        </li>
        <li>
            <img src="/media/check.svg" alt="checkmark">
            <p>Truly Decentralized</p>
        </li>
    </ul>
</div>

<style lang="scss">
  $text-on-accent-color: #fff;
  $text-color: #000;
  $accent-color: #3598DB;
  $dark-accent-color: #2A7AAF;
  $background-color: #081925;

  #intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    height: calc(80dvh - 5.125rem);

    .title {
      text-align: center;

      h3 {
        font-size: 0.875rem;
        text-transform: uppercase;
        font-weight: 600;
        color: $accent-color;

        padding: 0 0 0.75rem 0;
      }

      h1 {
        font-size: 2rem;
        font-weight: 600;
      }
    }

    .results {
      min-height: 3rem;
      max-height: 20dvh;
      overflow-y: scroll;

      li {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr auto;
        margin: 0.5rem 0;

        border: 0.1rem solid #ECF0F1;
        border-radius: 0.375rem;

        padding: 0.5rem 0.25rem 0.5rem 1rem;

        div {
          display: flex;
          align-items: center;
          gap: 1rem;

          white-space: nowrap;
          padding-left: 0.25rem;
        }

        p.name {
          word-wrap: anywhere;
        }

        button {
          border: none;
          border-radius: 0.375rem;
          background-color: $accent-color;
          color: $text-on-accent-color;

          padding: 0.5rem 1.125rem;

          cursor: pointer;
          transition: background-color 0.2s ease-in-out;

          &:hover {
            background-color: $dark-accent-color;
          }
        }

        &.taken {
          opacity: 0.6;

          div p {
            text-transform: uppercase;
          }
        }
      }
    }

    .guarantees {
      display: flex;
      gap: 2rem;

      li {
        display: flex;
        align-items: center;
        gap: 0.625rem;

        p {
          font-size: 1rem;
        }
      }
    }

    .search-wrapper {
      width: 30rem;
      max-width: 90dvw;

      .search {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto;

        input {
          font-size: 0.938rem;
          font-weight: 500;

          border: 0.063rem solid #ECF0F1;
          border-right: none;
          border-bottom-left-radius: 0.375rem;
          border-top-left-radius: 0.375rem;

          padding: 0.75rem 1rem;
        }

        button {
          font-size: 0.938rem;
          font-weight: 600;

          background-color: $accent-color;
          color: $text-on-accent-color;

          border: none;
          border-bottom-right-radius: 0.375rem;
          border-top-right-radius: 0.375rem;

          padding: 0.75rem 1.125rem;

          cursor: pointer;
          transition: background-color 0.2s ease-in-out;

          &:hover {
            background-color: $dark-accent-color;
          }
        }
      }
    }
  }
</style>