<script lang="ts">
    import {basket, clearBasket, removeFromBasket} from "../stores/basket";
    import api from "../utils/api";
    import type {DomainOrderResponse, DomainOrderItem} from "../types/api";
    import {DOMAIN_PRICE, PAYMENT_API_URL} from "../utils/constants";
    import Loader from "../lib/components/Loader.svelte";
    import QRCode from "@castlenine/svelte-qrcode"
    import {toast} from "@zerodevx/svelte-toast";
    import {link} from "svelte-spa-router";

    let addresses = [];
    let allReceiveAddress = "";
    let loadingFull = true;
    let isProcessing = false;
    let paymentDetails: DomainOrderResponse | null = null;
    let initiated = false;


    let order: DomainOrderItem[] = [];

    api.getAddresses().then((res) => {
        addresses = res;

        allReceiveAddress = addresses[0];
        order = $basket.map((domain) => {
            return {
                domain,
                target: addresses[0],
            };
        });
        loadingFull = false;
    });

    function deleteFromBasket(domain) {
        removeFromBasket(domain);
        order = order.filter((item) => item.domain !== domain);
    }

    async function handleSubmit() {
        isProcessing = true;
        try {
            paymentDetails = await api.createDomainOrder(order);
        } catch (e) {
            console.error(e);
            toast.push(e.message, {
                theme: {
                    '--toastWidth': '80dvw',
                    '--toastBackground': '#F56565',
                    '--toastProgressBackground': '#C53030',
                    '--toastProgressFill': '#fff',
                    '--toastColor': '#fff',
                },
            });
            isProcessing = false;
            return;
        }

        // TODO: Start background polling for payment status
        const orderStatusInterval = setInterval(async () => {
            const status = await api.getOrderStatus(paymentDetails!.id);

            if (status.initiated) {
                initiated = true;
                clearInterval(orderStatusInterval);
                clearBasket();
            }
        }, 1000);

    }
</script>

{#if loadingFull}
    <Loader/>
{:else if initiated}
    <div class="success">
        <img src="/media/basket/success.svg" alt="Payment received successfully">
        <p>We are processing your payment and will automatically inscribe the domain.</p>
        <p>Please know that this can take some time.</p>
        <p><a href="/me/domains" use:link>Go to your domains.</a></p>
    </div>
{:else}
    {#if isProcessing}
        <div class="loader" class:payment={paymentDetails !== null}>
            <div class="content">
                {#if paymentDetails !== null}
                    <div class="qr-wrapper">
                        <QRCode isResponsive content="bitcoin:{paymentDetails.address}"/>
                    </div>
                    <p>Send <span>{paymentDetails.amount}BTC</span> to:</p>
                    <p class="address">{paymentDetails.address}</p>
                    <p class="order-id">Order ID: {paymentDetails.id}</p>
                {:else}
                    <div class="loader-wrapper">
                        <Loader/>
                    </div>
                    <p>Processing, please do not close this page...</p>
                {/if}
            </div>
        </div>
    {/if}
    <form on:submit|preventDefault={handleSubmit}>
        <section id="basket">
            <h1>Basket</h1>

            <datalist id="owned-addresses">
                {#each addresses as address}
                    <option value={address} selected={address === addresses[0]}></option>
                {/each}
            </datalist>

            <div class="receive-all">
                <label for="receive-address">Receive address for all</label>
                <input id="receive-address" type="text" list="owned-addresses"
                       on:input={(e) => {
                    allReceiveAddress = e.target.value;

                    let newOrder = [...order];

                    newOrder.forEach((item) => {
                        item.target = allReceiveAddress;
                    });

                    order = newOrder;
                }}
                       value="{allReceiveAddress}"
                       disabled="{isProcessing}"
                >
            </div>
            <ul>
                {#each order as item, index}
                    <li>
                        <div>
                            <h3>{item.domain}</h3>
                            <button on:click={() => deleteFromBasket(item.domain)}
                                    type="button"
                                    disabled="{isProcessing}"
                            >
                                <img src="/media/basket/delete.svg" alt="Remove from basket">
                            </button>
                        </div>

                        <p class="price">{DOMAIN_PRICE}BTC</p>

                        <label for="receive-address-{item}">Receive address</label>
                        <input id="receive-address-{item}" type="text" list="owned-addresses"
                               bind:value={item.target}
                               on:input={(e) => {
                            order[index].target = e.target.value;
                            allReceiveAddress = "";
                       }}
                               required
                               disabled="{isProcessing}"
                        />
                    </li>
                {/each}
            </ul>
        </section>

        <section id="order">
            <h1>Order</h1>
            <h2>Total cost: {DOMAIN_PRICE * order.length}BTC</h2>
            <label for="accept-risk-warning">
                <input id="accept-risk-warning" type="checkbox" required
                       disabled="{isProcessing}"
                >
                I have read and agreed to the <a href="#/risk" target="_blank">risk warning</a>
            </label>
            <button
                    type="submit"
                    disabled="{isProcessing}"
            >
                Proceed
            </button>
        </section>
    </form>
{/if}

<style lang="scss">
  h1 {
    font-size: 2rem;
  }

  section {
    display: flex;
    flex-direction: column;
    width: 32.5rem;
    max-width: 90dvw;
    position: relative;
    margin: 1rem 0 0 0;

    &:first-child {
      margin-top: 3rem;
    }

    &:last-child {
      margin-bottom: 3rem;
    }
  }

  #basket {
    gap: 1rem;

    ul {
      list-style: none;
      padding: 0;
    }

    input {
      $padding-y: 0.2rem;
      $padding-x: 0.4rem;
      $border-width: 0.1rem;

      padding: $padding-y $padding-x;
      border-radius: 0.25rem;
      border: $border-width solid #ccc;
      width: calc(100% - #{$padding-x * 2} - #{$border-width * 2});
      margin-top: 0.25rem;
    }

    li {
      padding: 1rem;
      border: 0.1rem solid #ccc;
      margin-bottom: 0.5rem;

      .price {
        font-size: 75%;
        margin: -0.25rem 0 0.25rem 0;
      }

      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
      }

      button {
        background-color: transparent;
        border: none;
        padding: 0 0 0 1rem;
        border-radius: 0.5rem;
        cursor: pointer;

        img {
          height: 1rem;
        }
      }

      label[for^="receive-address-"] {
        padding-top: 0.5rem;
        font-size: 80%;
      }

      input[id^="receive-address-"] {
        display: block;
      }
    }

    .receive-all {
      input {
        display: block;
      }
    }
  }

  #order {
    gap: 0.5rem;

    a {
      color: #000;
      text-decoration: underline;
    }

    button {
      border: none;
      border-radius: 0.25rem;
      background-color: #3598DB;
      color: #fff;
      padding: 0.5rem 1rem;
      font-size: 1.25rem;
      font-weight: 600;
      cursor: pointer;
    }
  }

  .loader {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2rem;

    background-color: rgba(255, 255, 255, 0.5);
    z-index: 100000;

    .content {
      position: relative;

      width: 30rem;
      padding: 2rem;

      max-width: 100%;
      max-height: 100%;

      background-color: white;
      z-index: -1;

      border-radius: 1rem;
    }

    p {
      margin: 0.1rem auto;
      width: 20rem;
      max-width: 100%;
      text-align: center;
      word-break: break-word;
    }

    &.payment {
      gap: 0.5rem;

      p {
        span {
          font-weight: 600;
        }

        &.address {
          font-weight: 600;
          word-break: break-all;

        }

        &.order-id {
          font-size: 80%;
          opacity: 0.6;
          margin-top: 1rem;
        }
      }

      &::before {
        width: 30rem;
        height: 40rem;
      }
    }

    .qr-wrapper {
      margin: 0 auto;
      width: 20rem;
      height: 20rem;

      max-width: 100%;
      max-height: 100%;
    }

    .loader-wrapper {
      margin: 0 auto;
      padding: 1rem;
      width: 5rem;
      height: 5rem;

      max-width: 100%;
      max-height: 100%;
    }
  }

  .success {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 10rem;
      margin-bottom: 2rem;
    }

    p {
      text-align: center;
      line-height: 1.2rem;

      &:last-child {
        margin-top: 1rem;
      }
    }

    a {
      color: #000;
      text-decoration: underline;
    }
  }
</style>