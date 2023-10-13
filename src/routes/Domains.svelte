<script lang="ts">
    import {link} from "svelte-spa-router";

    interface Domain {
        domain: string,
        inscription: string,
        pending?: boolean
    }

    let domains: Domain[] = [
        {
            domain: "hello.o",
            pending: true,
            inscription: "38af84e019057604773af4b5ff93c862f89d8ffe5d391a9dd2ff57d341e07ca3i0"
        },
        {
            domain: "xiler.o",
            inscription: "38af84e019057604773af4b5ff93c862f89d8ffe5d391a9dd2ff57d341e07ca3i0"
        }
    ];
</script>


<div id="domains">
    {#if domains.length === 0}
        <h1>You don't have a <span>.o</span> domain!</h1>
        <p>Buy your unique .o domain <a href="/" use:link>here</a></p>
    {:else}
        <h1>Your <span>.o</span> domains:</h1>

        <ul class="domain-listing">
            {#each domains as domain}
                <li class:is-pending={domain?.pending}>
                    <p>
                        {domain.domain}
                    </p>
                    <a
                            title="{domain.domain} inscription"
                            href="https://ordinals.com/inscription/{domain.inscription}">inscription</a>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
  #domains {
    text-align: center;

    h1 {
      font-size: 1.5rem;
      padding-bottom: 1.5rem;

      span {
        color: #3598DB;
        font-weight: 700;
        font-family: "Inter", sans-serif;
        font-size: 2rem;
        padding: 0 0.25rem;
      }
    }

    .domain-listing {
      margin: 0 auto;
      width: fit-content;

      li {
        min-width: 30dvw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.2rem;

        font-size: 1.15rem;

        p {
          margin-right: 0.5rem;
        }

        a {
          background-color: #2A7AAF;
          color: #fff;

          padding: 0.5rem 0.75rem;
          border-radius: 0.25rem;

          text-decoration: none;
        }

        &.is-pending {
          opacity: 0.4;

          a {
            pointer-events: none;
          }
        }
      }
    }
  }
</style>