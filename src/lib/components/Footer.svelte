<script lang="ts">
    import api from "../../utils/api";
    import {AUTH_WEB_URL} from "../../utils/constants";

    const login = async () => {
        window.location.href = AUTH_WEB_URL;
    }

    $: isSignedIn = api.isSignedIn;
</script>

<footer>
    <div class="contents">
        <div class="initial-note">
            <h6>
                {#if $isSignedIn}
                    Decentralizing the centralized.
                {:else}
                    Embrace internet decentralization. Join us now.
                {/if}
            </h6>

            {#if !$isSignedIn}
                <button on:click={login}>Connect Wallet</button>
            {/if}
        </div>

        <div class="final-note">
            <p>© 2023 Xiler</p>

            <div class="socials">
                <a href="https://dc.xiler.net" target="_blank" rel="noopener noreferrer">
                    <img src="/media/footer/discord.svg" alt="Discord"/>
                </a>
                <a href="https://twitter.com/XilerNetwork" target="_blank" rel="noopener noreferrer">
                    <img src="/media/footer/twitter.svg" alt="Twitter"/>
                </a>
                <a href="https://github.com/XilerNet" target="_blank" rel="noopener noreferrer">
                    <img src="/media/footer/github.svg" alt="GitHub"/>
                </a>
            </div>
        </div>
    </div>
</footer>

<style lang="scss">
  footer {
    background-color: #0B1E2C;
    padding: 4rem 0;

    .contents {
      width: calc(100dvw - 4dvw * 2);
      max-width: 80rem;
      margin: 0 auto;
    }

    h6 {
      font-size: 2rem;
      font-weight: 600;
      color: #F7F9F9;
    }

    p {
      font-weight: 400;
      color: #BDC0C1;
    }

    .initial-note {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        background-color: #3598DB;
        border: none;
        border-radius: 0.375rem;
        color: #ECF0F1;
        padding: 0.75rem 1.125rem;
        font-weight: 600;
        font-size: 0.938rem;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;

        &:hover {
          background-color: #2C81BA;
        }
      }
    }

    .final-note {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 0.06rem solid #2C3E50;

      .socials {
        display: flex;
        gap: 0.75rem;

        img {
          display: inline-block;
          width: 1.5rem;
        }
      }

      @media (max-width: 70rem) {
        h6 {
          text-align: center;
        }
      }
    }
  }
</style>