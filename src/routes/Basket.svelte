<script lang="ts">
    import {basket, clearBasket, removeFromBasket} from "../stores/basket";
    import api from "../utils/api";
    import type {DomainOrderResponse, DomainOrderItem, PricingResponse} from "../types/api";
    import {AUTH_API_URL, DOMAIN_PRICE, PAYMENT_API_URL} from "../utils/constants";
    import Loader from "../lib/components/Loader.svelte";
    import QRCode from "@castlenine/svelte-qrcode"
    import {toast} from "@zerodevx/svelte-toast";
    import {link} from "svelte-spa-router";

    let addresses = [];
    let allReceiveAddress = "";
    let loadingFull = true;
    let isProcessing = false;
    let paymentDetails: DomainOrderResponse | null = null;
    let domainPricing: PricingResponse | null = null;
    let initiated = false;
    let orderExpiredCountdown = 30 * 60 * 1000;
    let xShareUrl = 'https://x.com/XilerNetwork';

    let order: DomainOrderItem[] = [];

    api.getAddresses()
        .then((res) => {
            addresses = res;

            allReceiveAddress = addresses[0];
            order = $basket.map((domain) => {
                return {
                    domain,
                    target: allReceiveAddress
                };
            });
            loadingFull = false;
            updateXShareUrl();
        });

    updateDomainPricing($basket.length);

    function deleteFromBasket(domain) {
        removeFromBasket(domain);
        order = order.filter((item) => item.domain !== domain);
        updateDomainPricing(order.length)
        updateXShareUrl();
    }

    async function handleSubmit() {
        isProcessing = true;
        try {
            paymentDetails = await api.createDomainOrder(order);
            orderExpiredCountdown = 30 * 60 * 1000;
        } catch (e) {
            isProcessing = false;
            return;
        }

        const orderStatusInterval = setInterval(async () => {
            const status = await api.getOrderStatus(paymentDetails!.id);

            if (status.initiated) {
                initiated = true;
                clearInterval(orderStatusInterval);
                clearBasket();
            }
        }, 1000);

        const orderCountDownInterval = setInterval(() => {
            orderExpiredCountdown -= 1000;

            if (initiated) {
                clearInterval(orderCountDownInterval);
            } else if (orderExpiredCountdown <= 0) {
                clearInterval(orderCountDownInterval);
                clearInterval(orderStatusInterval);
                isProcessing = false;
            }
        }, 1000);
    }

    function cancelOrder() {
        const proceed = window.confirm("Cancelling the order will not refund your payment. Are you sure you want to cancel?");

        if (!proceed) {
            return;
        }

        const paymentId = paymentDetails!.id;

        loadingFull = true;
        initiated = false;
        isProcessing = false;
        paymentDetails = null;

        api.deletePayment(paymentId).then(() => {
            loadingFull = false;
        });
    }

    async function updateDomainPricing(amount: number) {
        if (amount === 0) {
            domainPricing = null;
            return;
        }
        domainPricing = await api.getPricing(amount);
    }

    function updateXShareUrl() {
        let domains;
        if (order.length < 2) {
            domains = order.map(d => d.domain).join("%2C%20");
        } else {
            let suffix = ` and ${order[order.length - 1].domain}`;

            if (order.length > 2) {
                suffix = `,${suffix}`;
            }

            domains = order.slice(0, order.length - 1).map(d => d.domain).join("%2C%20") + suffix;
        }
        xShareUrl = `https://x.com/intent/tweet?text=Just%20bought%20my%20decentralized%20domain${order.length > 1 ? 's' : ''}%20${domains}%20via%20@XilerNetwork!%0A%0A&url=https://xiler.net`;
    }
</script>

<svelte:head>
    <title>Xiler Network | Basket</title>

    <link rel="preconnect" href="{PAYMENT_API_URL}">
    <link rel="preconnect" href="{AUTH_API_URL}">
</svelte:head>

{#if loadingFull}
    <Loader/>
{:else if initiated}
    <div class="success">
        <img src="/media/basket/success.svg" alt="Payment received successfully">
        <p>We are processing your payment and will automatically inscribe the domain.</p>
        <p>Please know that this can take some time.</p>
        <p class="share-x">
            <a href="{xShareUrl}" target="_blank" rel="noopener noreferrer">
                <img src="/media/basket/x.svg" alt="Share on X">
                Share
            </a>
        </p>
    </div>
{:else}
    {#if isProcessing && orderExpiredCountdown > 0}
        <div class="loader" class:payment={paymentDetails !== null}>
            <div class="content">
                {#if paymentDetails !== null}
                    <button class="cancel-payment" title="Cancel Order" on:click={cancelOrder}></button>
                    <div class="qr-wrapper">
                        <QRCode isResponsive content="bitcoin:{paymentDetails.address}"/>
                    </div>
                    <p>Send <span>{paymentDetails.amount}BTC</span> to:</p>
                    <p class="address">{paymentDetails.address}</p>
                    <p class="order-id">Order ID: {paymentDetails.id}</p>
                    <p class="order-id">This order expires in
                        {#if orderExpiredCountdown > 0}
                            {#if orderExpiredCountdown > 60 * 1000}
                                {#if orderExpiredCountdown > 60 * 60 * 1000}
                                    {#if orderExpiredCountdown > 24 * 60 * 60 * 1000}
                                        {Math.floor(orderExpiredCountdown / (24 * 60 * 60 * 1000))} days
                                    {:else}
                                        {Math.floor(orderExpiredCountdown / (60 * 60 * 1000))} hours
                                    {/if}
                                {:else}
                                    {Math.floor(orderExpiredCountdown / (60 * 1000))} minutes
                                {/if}
                            {:else}
                                {Math.floor(orderExpiredCountdown / 1000)} seconds
                            {/if}
                        {:else}
                            0 seconds
                        {/if}
                    </p>

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
                       on:keydown={(e) => {
                          if (e.key === " ") {
                              e.preventDefault();
                          }
                       }}
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
                               on:keydown={(e) => {
                                  if (e.key === " ") {
                                      e.preventDefault();
                                  }
                               }}
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
            <ul class="transcript">
                <li>
                    <p>Total cost</p>
                    <p>{DOMAIN_PRICE * order.length}BTC</p>
                </li>
                {#if domainPricing !== null && (domainPricing.stackable_loyalty_discounts.length !== 0 || domainPricing.non_stackable_loyalty_discounts.length !== 0)}
                    <li><h2>Loyalty program benefits:</h2></li>
                    {#each domainPricing.stackable_loyalty_discounts as loyalty}
                        <li>
                            <p>{@html loyalty.message}</p>
                            <p>-{loyalty.amount}{loyalty.currency}</p>
                        </li>
                    {/each}
                    {#if domainPricing.non_stackable_loyalty_discounts.length !== 0}
                        <li>
                            <p>Holder of:
                                {#each domainPricing.non_stackable_loyalty_discounts as holder}
                                    <span class="collection">{@html holder}</span>
                                {/each}
                            </p>
                            <p>
                                -{domainPricing.non_stackable_loyalty_discount}{domainPricing.non_stackable_loyalty_discount_currency}</p>
                        </li>
                    {/if}
                    <li class="total-discount">
                        <p>Total discount</p>
                        <p>-{100 - ((domainPricing.final_price / (DOMAIN_PRICE * order.length)) * 100)}%</p>
                    </li>
                    <li class="final-cost">
                        <p>Final cost:</p>
                        <p>{domainPricing.final_price}BTC</p>
                    </li>
                {/if}
            </ul>
            <label for="accept-risk-warning">
                <input id="accept-risk-warning" type="checkbox" required
                       disabled="{isProcessing}"
                >
                I have read and agreed to the <a href="#/risk" rel="noopener noreferrer" target="_blank">risk
                warning</a>
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

    .transcript {
      h2 {
        font-size: 1.1rem;
        font-weight: 500;

        margin: 0.5rem 0 0 0;
      }

      li {
        display: grid;
        grid-template-columns: 1fr max-content;
        gap: 0.5rem;

        margin-top: 0.5rem;

        &:first-child {
          margin-top: 0;
        }

        &.total-discount {
          font-weight: 600;
        }

        &.final-cost {
          margin-top: 1.5rem;
          font-weight: 600;
        }

        :global(a) {
          color: #000;
          text-decoration: underline;
        }

        .collection {
          white-space: nowrap;

          &::after {
            content: ", ";
          }

          &:last-child::after {
            content: "";
          }
        }
      }
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

    .cancel-payment {
      $size: 1.5rem;

      border: none;
      border-radius: calc($size / 4);
      background-color: #3598DB;
      width: $size;
      height: $size;

      position: absolute;
      top: 1rem;
      right: 1rem;

      cursor: pointer;

      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;

        width: calc($size / 1.5);
        height: calc($size / 8);
        background-color: #fff;
        border-radius: calc($size / 8);
      }

      &::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
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
      filter: drop-shadow(0 0.5rem 1rem rgba(0, 0, 0, 0.2));
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

  .share-x a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 4rem;
    background-color: #000000;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;

    img {
      height: 1.5rem;
      width: 1.5rem;
      margin: 0 0.5rem 0 0;
    }

    &:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
      transform: translateY(-0.1rem);
      opacity: 0.9;
    }
  }

</style>
