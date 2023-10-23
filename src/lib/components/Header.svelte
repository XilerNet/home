<script lang="ts">
    import api from "../../utils/api";
    import {link} from "svelte-spa-router";
    import {AUTH_WEB_URL} from "../../utils/constants";
    import {basket} from "../../stores/basket";

    let menuOpen = false;

    const logout = async () => {
        await api.logout();
        window.location.href = "/";
    }

    const login = async () => {
        window.location.href = AUTH_WEB_URL;
    }

    $: isSignedIn = api.isSignedIn;
    $: hasItemInBasket = $basket.length > 0;

    api.initSignedIn().then();
</script>


<header>
    <div class="contents">
        <div class="default-menu" class:menu-open={menuOpen}>
            <a class="xiler" href="/" use:link>
                <img src="/logo.svg" alt="logo">
                <p>Xiler <span>alpha</span></p>
            </a>

            <nav>
                <ul>
                    <li><a href="/" use:link>Home</a></li>
                    <li><a href="https://github.com/XilerNet/specification" rel="noopener noreferrer" target="_blank">Specification</a></li>
                    <li><a href="https://dc.xiler.net" rel="noopener noreferrer" target="_blank">Support</a></li>
                </ul>
            </nav>

            <div class="login">
                {#if $isSignedIn}
                    <button class="logout" on:click={logout}>Logout</button>
                {:else}
                    <button on:click={login}>Connect Wallet</button>
                {/if}
            </div>
            <div class="menu-toggle">
                <button on:click={() => { menuOpen = !menuOpen; }}>
                    <img src="/media/header/hamburger.svg" alt="hamburger">
                </button>
            </div>
        </div>

        {#if $isSignedIn}
            <div class="menu-bar">
                <nav>
                    <ul>
                        <li><a href="/me/domains" use:link>Domains</a></li>
                        <!--                        <li><a href="/me/wallets" use:link>Wallets</a></li>-->
                    </ul>
                    <ul>
                        <li>
                            <a href="/me/basket" use:link class="basket {hasItemInBasket ? 'full' : ''}">
                                <img src="/media/header/cart.svg" alt="basket">
                            </a>
                        </li>
                        <!--                        <li>-->
                        <!--                            <a href="/me" use:link>-->
                        <!--                                <img src="/media/header/user.svg" alt="user">-->
                        <!--                            </a>-->
                        <!--                        </li>-->
                    </ul>
                </nav>
            </div>
        {/if}
    </div>
</header>
<div class="{$isSignedIn ? 'spacer-large' : 'spacer-small'}"></div>

<style lang="scss">
  $text-color: #fff;
  $accent-color: #3598DB;
  $dark-accent-color: #2A7AAF;
  $background-color: #081925;

  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
    background-color: $background-color;
    width: 100%;

    .contents {
      position: relative;
      width: calc(100dvw - 4dvw * 2);
      max-width: 80rem;
      margin: 0 auto;
      z-index: 101000;

      @media (max-width: 768px) {
        width: calc(100dvw - 8dvw * 2);

        .menu-bar .basket {
          z-index: 1;
          transition: z-index 0s 0.2s ease-in-out;
        }

        .default-menu {
          transform-style: preserve-3d;
          transform: translateZ(-1px);
          background-color: $background-color;

          nav {
            position: absolute;
            top: -115%;
            left: -8dvw;
            width: 100dvw;
            padding: 1.5rem 0 2rem 0;
            transform: translateZ(-1px);

            transition: top 0.2s ease-in-out;
            background-color: $background-color;
            height: fit-content;

            ul {
              width: 100%;
              flex-direction: column;
              gap: 2rem;

              li {
                width: 100%;

                a {
                  width: 100%;
                  display: block;
                  text-align: center;
                  font-size: 1.1rem;
                  pointer-events: none;
                }
              }
            }
          }

          .login {
            position: fixed;
            bottom: calc(-100vh - 1.125rem);
            left: -8vw;
            width: 100vw;
            padding: 1.5rem 0;

            transition: bottom 0.2s ease-in-out;
            background-color: $background-color;
            height: fit-content;

            display: flex;
            justify-content: center;

            button {
              width: 90%;
              display: block;
              text-align: center;
              font-size: 1.1rem;
            }
          }
        }

        .default-menu.menu-open {
          nav {
            top: 5.125rem;

            ul {
              li {
                a {
                  pointer-events: all;
                }
              }
            }
          }

          .login {
            bottom: calc(-100vh + 5.125rem);
          }
        }

        .default-menu.menu-open + .menu-bar .basket {
          transition: z-index 0s 0s ease-in-out;
          z-index: -1;
        }
      }
    }

    .menu-bar,
    .default-menu {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: fit-content;
      padding: 1.25rem 0;


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

      .menu-toggle {
        display: none;

        @media (max-width: 768px) {
          display: block;
        }

        button {
          $size: 2rem;

          background-color: transparent;
          border: none;
          cursor: pointer;
          display: block;
          padding: 0;
          margin: 0;

          &,
          img {
            width: $size;
            height: $size;
          }
        }
      }

      .login {
        button {
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
    }

    .menu-bar {
      //padding-top: 0;
      padding-top: 0.15rem;

      nav {
        width: 100%;
        justify-content: space-between;
        padding-top: 1.25rem;

        border-top: 0.063rem solid #2F3030;

        li {
          display: flex;
          align-items: center;
        }

        .basket {
          position: relative;

          &.full::after {
            content: "";
            position: absolute;
            top: -0.05rem;
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