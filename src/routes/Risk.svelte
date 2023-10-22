<svelte:head>
    <title>Xiler Network | Risk Disclosure</title>
</svelte:head>


<article>
    <h1>Risk Disclosure</h1>

    <ol>
        <li>
            <p>
                Front Running Risk: We cannot verify if another inscriber has registered the same domain in the current
                block, making it impossible to ensure the validation of your domain. While the likelihood of this
                occurring is minimal, exercise caution when inscribing common names (e.g., short letter abbreviations or
                common words). Please do note that we provide internal checks to prevent this behaviour on our platform.
            </p>
        </li>

        <li>
            <p>
                Platform Order Congestion: During periods of platform order congestion, delays in on-chain processing
                may occur, and we cannot provide a guarantee for the on-chain processing time.
            </p>
        </li>
    </ol>

    <p> Please thoroughly assess and comprehend these risks, and be prepared to accept any consequences that may arise
        from them. </p>
</article>

<style lang="scss">
  article {
    width: 50rem;
    max-width: 90dvw;

    h1 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 3rem;
      text-align: center;
    }

    ol {
      list-style-type: decimal;
      margin-left: 1rem;

      li {
        margin-bottom: 1rem;
      }
    }

    p {
      line-height: 1.5rem;
    }

    & > p {
      margin-top: 2rem;
    }
  }
</style>