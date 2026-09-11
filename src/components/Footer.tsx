function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <a href="/" className="footer-logo" aria-label="GETprospeKt Home">
              <img
                src="../assets/images/gett.png"
                alt="GETprospeKt"
                className="footer-getprospekt-logo"
              />
            </a>

            <p className="footer-tagline">
              Better Pipeline Starts With Better Decisions.
            </p>

            <p className="footer-description">
              We help businesses scale through automated outreach.
            </p>

            <div className="footer-contact-details">
              <a className="footer-email" href="mailto:kalpesh@getprospekt.co">
                kalpesh@getprospekt.co
              </a>

              <a className="footer-phone" href="tel:+919904150300">
                +91 99041 50300
              </a>

              <p className="footer-address">
                03 FLOOR F: NO 301 O WINGLAKESIDE PALAVA KHONI, THANE KALYAN,
                THANE 421204, MAHARASHTRA, INDIA
              </p>
            </div>
          </div>

          <div className="footer-column">
            <h3>About</h3>

            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
            <a href="/subscribe">Subscribe</a>
          </div>

          <div className="footer-column">
            <h3>Policies</h3>

            <a href="/privacy-policy">Privacy Policy</a>
          </div> 
        </div>
      </footer>

      <style>{`
        .site-footer {
          width: 100%;
          background: #ECEBFF;
          color: #17152A;
          margin-top: 0;
        }

        .footer-container {
          width: min(1640px, calc(100% - 80px));
          margin: 0 auto;
          min-height: 455px;
          padding: 34px 0 26px;
          display: grid;
          grid-template-columns: 1.25fr 1fr 1fr 1.1fr;
          column-gap: 45px;
          align-items: start;
        }

        .footer-brand {
          max-width: 410px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          width: 220px;
          height: 95px;
          text-decoration: none;
        }

        .footer-getprospekt-logo {
          display: block;
          width: 260px;
          max-width: 100%;
          height: auto;
          max-height: 95px;
          object-fit: contain;
        }

        .footer-tagline {
          margin: 3px 0 22px;
          font-size: 14px;
          line-height: 1.4;
        }

        .footer-description {
          max-width: 405px;
          margin: 0 0 21px;
          font-size: 14px;
          line-height: 1.4;
        }

        .footer-email {
          display: block;
          width: fit-content;
          margin: 0 0 13px;
          color: #121022;
          text-decoration: none;
          font-size: 16px;
          line-height: 1.3;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .footer-phone {
          display: block;
          width: fit-content;
          margin: 0 0 14px;
          color: #121022;
          text-decoration: none;
          font-size: 16px;
          line-height: 1.3;
          font-weight: 800;
        }

        .footer-address {
          max-width: 405px;
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: #353247;
        }

        .footer-contact-details {
          margin-top: 2px;
        }

        .footer-email:hover,
        .footer-column a:hover {
          text-decoration: underline;
        }

        .footer-column h3,
        .footer-social h3 {
          margin: 5px 0 14px;
          font-size: 23px;
          line-height: 1.1;
          font-weight: 800;
        }

        .footer-column a {
          display: block;
          padding: 0 0 12px;
          margin: 0 0 18px;
          border-bottom: 1px solid #C9C7D8;
          color: #17152A;
          text-decoration: none;
          font-size: 16px;
          line-height: 1.25;
        }

        .footer-social {
          padding-left: 0;
        }

        .social-icons {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .social-icons a {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #17152A022;
          color: #FFFFFF;
          text-decoration: none;
        }

        .social-icons svg {
          width: 31px;
          height: 31px;
          fill: currentColor;
          stroke: currentColor;
          stroke-width: 1.8;
        }

        .social-icons svg rect,
        .social-icons svg circle {
          fill: none;
        }

        .social-icons .fill-dot {
          fill: currentColor;
          stroke: none;
        }

        .social-icons .youtube-play {
          fill: #17152A022;
          stroke: none;
        }

        @media (max-width: 1100px) {
          .footer-container {
            width: min(940px, calc(100% - 40px));
            grid-template-columns: 1.3fr 1fr 1fr;
            row-gap: 35px;
          }

          .footer-social {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 760px) {
          .footer-container {
            width: calc(100% - 34px);
            min-height: auto;
            padding: 35px 0 25px;
            grid-template-columns: 1fr 1fr;
            gap: 30px 25px;
          }

          .footer-brand {
            grid-column: 1 / -1;
            max-width: none;
          }

          .footer-description {
            max-width: 600px;
          }

          .footer-address {
            max-width: 100%;
          }

          .footer-column h3,
          .footer-social h3 {
            font-size: 23px;
          }

          .footer-column a {
            font-size: 16px;
          }

          .footer-social {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            width: calc(100% - 28px);
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .footer-logo {
            width: 175px;
            height: 78px;
          }

          .footer-getprospekt-logo {
            width: 210px;
            max-height: 78px;
          }

          .footer-tagline {
            font-size: 14px;
          }

          .footer-description {
            font-size: 14px;
          }

          .footer-email {
            font-size: 17px;
          }

          .footer-column,
          .footer-social {
            grid-column: auto;
          }

          .social-icons {
            gap: 9px;
          }

          .social-icons a {
            width: 45px;
            height: 45px;
          }

          .social-icons svg {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
