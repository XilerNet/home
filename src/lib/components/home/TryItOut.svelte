<article id="try-it-out">
    <h4> Don’t take our word for it, try it out! </h4>
    <p>While many projects make promises they can't keep, we've taken a different approach. We've already built our
        tools before releasing them, so go ahead and give them a try!</p>

    <img src="/media/try-it-out/side-img.svg" alt="">

    <section>
        <img src="/media/try-it-out/node.svg" alt="Node">
        <h5>Try our dns node!</h5>
        <p>We have a built a dns node! Feel free to utilize it!</p>
        <p>Try it at: <span><a href="https://github.com/XilerNet/dns" target="_blank" rel="noopener noreferrer">github.com/XilerNet/dns</a></span></p>
    </section>

<!--    <section>-->
<!--        <img src="/media/try-it-out/reverse-proxy.svg" alt="Accessible">-->
<!--        <h5>Try our reverse proxy!</h5>-->
<!--        <p>To enable universal access without requiring DNS settings changes, we've developed a proxy that acts as the-->
<!--            website. Please note that we assume no responsibility for the displayed content.</p>-->
<!--        <button>Check it out now!</button>-->
<!--    </section>-->
</article>

<style lang="scss">
  #try-it-out {
    display: grid;
    grid-template-columns: auto 25rem;
    align-items: center;
    justify-content: center;
    width: 90dvw;
    max-width: 65rem;
    margin: 5rem auto;
    gap: 2rem 4rem;
    padding: 6rem 0;

    h4, h5 {
      font-weight: 600;
      color: #2F3030;
    }

    h4 {
      font-size: 2rem;
    }

    p {
      color: #5E6060;

      span {
        font-size: 1.25rem;
        font-weight: 700;
        color: #3598DB;

        a {
            color: #3598DB;
        }
      }
    }

    & > p {
      margin-bottom: 1rem;
    }

    section {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;

      img {
        background-color: #3598DB;
        border-radius: 50%;
        padding: 0.5rem;
        grid-row: 1 / 4;
      }

      h5 {
        font-size: 1.375rem;
      }

      //button {
      //  background-color: #3598DB;
      //  border: none;
      //  border-radius: 0.375rem;
      //  padding: 0.75rem 1.125rem;
      //  color: #fff;
      //  font-size: 0.938rem;
      //  font-weight: 600;
      //  cursor: pointer;
      //  transition: background-color 0.2s ease-in-out;
      //  width: fit-content;
      //
      //  &:hover {
      //    background-color: #2A7AAF;
      //  }
      //}
    }

    & > img {
      grid-column: 2 / 3;
      grid-row: 1 / 5;
      width: 100%;
      place-self: center;
    }

    @media (max-width: 70rem) {
      grid-template-columns: 1fr;
      gap: 2rem;

      & > img {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        max-width: 30rem;
      }
    }
  }
</style>