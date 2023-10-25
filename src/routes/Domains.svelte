<script lang="ts">
    import {link} from "svelte-spa-router";
    import api from "../utils/api";
    import type {Domain, OwnedDomain} from "../types/api";
    import Loader from "../lib/components/Loader.svelte";
    import {AUTH_API_URL, DOMAINS_API_URL, PAYMENT_API_URL} from "../utils/constants";

    let loaded_bit = 0;
    const setLoaded = (i: number) => loaded_bit |= i;
    $: loaded = (loaded_bit & 1) === 1 && (loaded_bit & 2) === 2;

    let domains: Domain[] = [];
    let ownedDomains: OwnedDomain[] = [];
    let downloadingPrivateKeyFor = new Set<string>();

    api.getDomains().then((res) => {
        domains = res;
        setLoaded(1);
    });

    api.getOwnedDomains().then((res) => {
        ownedDomains = res;
        setLoaded(2);
    });

    async function downloadPrivateKeyOf(domain: string) {
        if (downloadingPrivateKeyFor.has(domain)) return;

        downloadingPrivateKeyFor.add(domain);
        const private_key_blob = await api.getPrivateKey(domain);
        const url = URL.createObjectURL(private_key_blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${domain}.key`;
        link.click();
        downloadingPrivateKeyFor.delete(domain);
    }
</script>

<svelte:head>
    <title>Xiler Network | Your decentralised domains</title>

    <link rel="preconnect" href="{DOMAINS_API_URL}">
    <link rel="preconnect" href="{PAYMENT_API_URL}">
    <link rel="preconnect" href="{AUTH_API_URL}">
</svelte:head>


<div id="domains">
    {#if loaded}
        {#if domains.length === 0 && ownedDomains.length === 0}
            <h1>You don't have a <span>.o</span> domain!</h1>
            <p>Buy your unique .o domain <a href="/" use:link>here</a></p>
        {:else}
            <h1>Your <span>.o</span> domains:</h1>

            <ul class="domain-listing">
                {#each ownedDomains as domain}
                    <li>
                        <p>{domain.domain}</p>

                        <div class="domain-contents">
                            {#if domain?.reveal_tx !== null}
                                {#if domains.findIndex(o => o.domain === domain.domain) !== -1}
                                    <a
                                            title="{domain.domain} inscription"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://ordinals.com/inscription/{domains.find(o => o.domain === domain.domain)?.inscription}"
                                    >
                                        inscription
                                    </a>
                                {:else}
                                    <a
                                            title="{domain.domain} inscription"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://ordinals.com/inscription/{domain.reveal_tx}i0"
                                    >
                                        inscription
                                    </a>
                                {/if}
                            {:else}
                                <a
                                        title="{domain.domain} payment"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="/"
                                        class="processing"
                                >
                                    processing payment
                                </a>
                            {/if}

                            <button
                                    disabled={downloadingPrivateKeyFor.has(domain.domain)}
                                    on:click={() => downloadPrivateKeyOf(domain.domain)}
                            >
                                <img
                                        src="/media/domains/key.svg"
                                        alt="Download private key of {domain.domain}"
                                        title="Download private key of {domain.domain}"
                                />
                            </button>
                        </div>
                {/each}
                {#each domains.filter(d => !ownedDomains.find(o => o.domain === d.domain)) as domain}
                    <li class="external">
                        <p>{domain.domain}</p>

                        <a
                                title="{domain.domain} inscription"
                                target="_blank"
                                href="https://ordinals.com/inscription/{domain.inscription}"
                        >
                            externally managed
                        </a>
                {/each}

            </ul>
        {/if}
    {:else}
        <Loader/>
    {/if}
</div>

<style lang="scss">
  #domains {
    padding: 5rem 0;
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
        width: 40rem;
        max-width: 90dvw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.2rem;

        font-size: 1.15rem;

        &.external {
          opacity: 0.8;

          :first-of-type {
            margin-top: 3rem;
          }

          a {
            background-color: #E84C3D;
          }
        }

        p {
          margin-right: 0.5rem;
        }

        a {
          background-color: #3598DB;
          color: #fff;

          padding: 0.5rem 0.75rem;
          transition: background-color 0.2s ease-in-out;

          &:hover {
            background-color: darken(#3598DB, 10%);
          }
        }

        button,
        a {
          display: inline-block;

          border: 0;
          border-radius: 0.25rem;

          text-decoration: none;

          &.processing {
            pointer-events: none;
            opacity: 0.5;
          }
        }

        button {
          cursor: pointer;
          background-color: #35C57B;
          font-size: 1rem;
          transition: background-color 0.2s ease-in-out;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          &:hover {
            background-color: #35B17B;
          }

          img {
            height: 1.4rem;
            padding: 0.25rem 0.5rem;
          }
        }

        .domain-contents {
          display: flex;
          gap: 0.5rem;
        }
      }
    }
  }
</style>