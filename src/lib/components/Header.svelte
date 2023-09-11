<script lang="ts">
    import api from "../../utils/api";
    import {link} from "svelte-spa-router";
    import {AUTH_WEB_URL} from "../../utils/constants";

    const logout = async () => {
        await api.logout();
        console.log("Logged out")
        window.location.reload();
        console.log("Reloaded")
    }

    const login = async () => {
        window.location.href = AUTH_WEB_URL;
    }

    $: isSignedIn = api.isSignedIn;

    // TODO: Dynamic basket detection
    let hasItemInBasket = false;

    api.initSignedIn().then();
</script>


<header>
    <div class="default-menu">
        <a class="xiler" href="/" use:link>
            <img src="/logo.svg" alt="logo">
            <p>Xiler <span>alpha</span></p>
        </a>

        <nav>
            <ul>
                <li><a href="/" use:link>Home</a></li>
                <li><a href="/docs" use:link>Documentation</a></li>
                <li><a href="https://dc.xiler.net" target="_blank">Support</a></li>
            </ul>
        </nav>

        <div class="login">
            {#if $isSignedIn}
                <button class="logout" on:click={logout}>Logout</button>
            {:else}
                <button on:click={login}>Connect Wallet</button>
            {/if}
        </div>
    </div>

    {#if $isSignedIn}
        <div class="menu-bar">
            <nav>
                <ul>
                    <li><a href="/me/domains" use:link>Domains</a></li>
                    <li><a href="/me/wallets" use:link>Wallets</a></li>
                </ul>
                <ul>
                    <li>
                        <a href="/me/basket" use:link class="basket {hasItemInBasket ? 'full' : ''}">
                            <img src="/media/cart.svg" alt="basket">
                        </a>
                    </li>
                    <li>
                        <a href="/me" use:link>
                            <img src="/media/user.svg" alt="user">
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    {/if}
</header>
<div class="{$isSignedIn ? 'spacer-large' : 'spacer-small'}"></div>

<style lang="scss">
  $header-side-spacing: 4dvw;
  $text-color: #fff;
  $accent-color: #3598DB;
  $dark-accent-color: #2A7AAF;
  $background-color: #081925;

  header {
    position: fixed;
    top: 0;
    left: 0;

    .menu-bar,
    .default-menu {
      display: flex;
      align-items: center;
      justify-content: space-between;

      width: calc(100dvw - #{$header-side-spacing} * 2);
      height: fit-content;
      padding: 1.25rem #{$header-side-spacing};

      background-color: $background-color;

      .xiler {
        display: flex;

        align-items: center;
        gap: 0.875rem;

        width: fit-content;
        height: fit-content;

        text-decoration: none;

        img, p {
          display: block;
        }

        img {
          width: 2.625rem;
          height: 2.625rem;
        }

        p {
          position: relative;

          padding: 0;
          margin: 0;

          color: $text-color;

          font-size: 1.563rem;
          font-weight: 700;
          font-family: 'Quicksand', sans-serif;

          span {
            position: absolute;
            font-size: 0.7rem;

            bottom: -50%;
            right: -25%;
          }
        }
      }

      nav {
        display: flex;
        justify-content: center;


        ul {
          display: flex;
          // TODO: Dynamic
          gap: 1.25rem;

          li {
            list-style: none;

            a {
              text-decoration: none;
              color: $text-color;
              font-size: 0.938rem;
              font-weight: 600;
              font-family: 'Quicksand', sans-serif;

              transition: color 0.2s ease-in-out;

              &:hover {
                color: $accent-color;
              }
            }
          }
        }
      }

      .login button {
        font-family: 'Inter', sans-serif;
        font-size: 0.938rem;
        font-weight: 600;

        color: $text-color;
        background-color: $accent-color;
        padding: 0.75rem 1.125rem;

        border: none;
        border-radius: 0.375rem;

        cursor: pointer;

        transition: background-color 0.2s ease-in-out;

        &:hover {
          background-color: $dark-accent-color;
        }

        &.logout {
          color: $accent-color;
          background-color: $background-color;
          transition: color 0.2s ease-in-out;

          &:hover {
            color: $dark-accent-color;
          }
        }
      }
    }

    .menu-bar {
      //padding-top: 0;
      padding-top: 0.15rem;

      nav {
        width: 100%;
        justify-content: space-between;
        padding-top: 1.25rem;

        border-top: 0.063rem solid #2F3030;


        .basket {
          position: relative;

          &.full::after {
            content: "";
            position: absolute;
            top: -0.575rem;
            right: -0.05rem;
            width: 0.6rem;
            height: 0.6rem;
            background-color: #E84C3D;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .spacer-small {
    height: 5.125rem;
  }

  .spacer-large {
    height: 9.625rem;
  }
</style>