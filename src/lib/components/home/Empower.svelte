<article id="empower-the-web">
    <img src="/media/empower/wave.svg" alt="" class="wave"/>
    <div class="contents">
        <h2>Empower the Web</h2>
        <p>Unlock online freedom: Decentralize domains and DNS records for enhanced security, autonomy, and censorship
            resistance. Embrace a resilient future, where control is distributed and internet access is
            democratized.</p>
        <ul>
            <li>
                <img src="/media/empower/secure.svg" alt="shield"/>
                <h3>Robust security</h3>
                <p>Decentralized domains on Bitcoin offer robust protection against hacking and unauthorized
                    changes.</p>
            </li>
            <li>
                <img src="/media/empower/dns.svg" alt="dns"/>
                <h3>Fully Usable DNS System</h3>
                <p>Unlock the full potential of your .o domain by harnessing the power of subdomains, just like any
                    other domain.</p>
            </li>
            <li>
                <img src="/media/empower/uncensorable.svg" alt="no blocking"/>
                <h3>Uncensorable Access</h3>
                <p>Decentralized domains on Bitcoin resist censorship, ensuring unrestricted website access. Nodes can
                    maintain individual blacklist files for control and flexibility.</p>
            </li>
            <li>
                <img src="/media/empower/resilient.svg" alt="strong"/>
                <h3>Resilient Infrastructure</h3>
                <p>The .o domain space exhibits enhanced resilience against disruptions and failures.</p>
            </li>
            <li>
                <img src="/media/empower/accessible.svg" alt="accessible"/>
                <h3>Accessible</h3>
                <p>Seamlessly register, renew, and manage domains.</p>
            </li>
            <li>
                <img src="/media/empower/phishing.svg" alt="hook"/>
                <h3>Prevent phishing</h3>
                <p>The .o domain space enforces stringent name restrictions, effectively thwarting phishing attacks.</p>
            </li>
        </ul>
    </div>
    <img src="/media/empower/wave.svg" alt="" class="wave flip"/>
</article>

<style lang="scss">
  #empower-the-web {
    width: 100%;

    display: flex;
    flex-direction: column;
    overflow-x: hidden;

    .wave {
      width: 100dvw;

      &.flip {
        transform: rotate(180deg);
      }
    }

    .contents {
      background-color: #2A7AAF;
      padding: 6rem 2rem;

      h2, h3 {
        color: #ECF0F1;
        text-align: center;
      }

      h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        font-weight: 700;
      }

      h3 {
        font-size: 1.375rem;
        font-weight: 600;
      }

      p {
        font-size: 1rem;
        text-align: center;
        color: #AED6F1;
        font-weight: 400;
      }

      & > p {
        width: 90dvw;
        max-width: 50rem;
        margin: 0 auto;
      }

      ul {
        margin: 4rem auto 0 auto;
        display: grid;
        width: 100%;
        max-width: 70rem;
        grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
        gap: 3rem 1rem;


        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;

          img {
            display: block;
            padding: 0.5rem;
            background-color: #5DADE2;

            transition: background-color 0.2s ease-in-out;
            border-radius: 0.313rem;
          }

          &:hover {
            img {
              background-color: #3598DB;
            }
          }
        }
      }
    }
  }
</style>