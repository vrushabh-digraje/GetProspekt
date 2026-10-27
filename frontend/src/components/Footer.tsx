import gettLogo from "../assets/images/gett.png";

function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-container">

          <div className="footer-brand">
            <a
              href="/"
              className="footer-logo"
              aria-label="GETprospeKt Home"
            >
              <img
                src={gettLogo}
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
              <a
                className="footer-email"
                href="mailto:kalpesh@getprospekt.co"
              >
                kalpesh@getprospekt.co
              </a>

              <a
                className="footer-phone"
                href="tel:+919904150300"
              >
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
          background: #060B12;
          color: #D5DBE7;
          border-top: 1px solid rgba(203, 213, 225, 0.1);
          margin-top: 0;
        }

        .footer-container {
          width: min(1640px, calc(100% - 80px));
          margin: 0 auto;
          min-height: 360px;
          padding: 30px 0 0;
          display: grid;
          grid-template-columns: 1.25fr 1fr 1fr 1.1fr;
          column-gap: 45px;
          align-items: start;
          box-sizing: border-box;
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
          color: #FFFFFF;
        }

        .footer-description {
          max-width: 405px;
          margin: 0 0 21px;
          font-size: 14px;
          line-height: 1.4;
          color: #AEB8CA;
        }

        .footer-email {
          display: block;
          width: fit-content;
          margin: 0 0 13px;
          color: #FFFFFF;
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
          color: #FFFFFF;
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
          color: #94A3B8;
        }

        .footer-contact-details {
          margin-top: 2px;
        }

        .footer-email:hover,
        .footer-phone:hover,
        .footer-column a:hover {
          color: #00D2FF;
          text-decoration: none;
        }

        .footer-column h3 {
          margin: 5px 0 14px;
          font-size: 23px;
          line-height: 1.1;
          font-weight: 800;
          color: #FFFFFF;
        }

        .footer-column a {
          display: block;
          padding: 0 0 12px;
          margin: 0 0 18px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.08);
          color: #D5DBE7;
          text-decoration: none;
          font-size: 16px;
          line-height: 1.25;
          transition: color 0.2s ease;
        }

        @media (max-width: 1100px) {
          .footer-container {
            width: min(940px, calc(100% - 40px));
            grid-template-columns: 1.3fr 1fr 1fr;
            row-gap: 35px;
          }
        }

        @media (max-width: 760px) {
          .footer-container {
            width: calc(100% - 34px);
            min-height: auto;
            padding: 30px 0 10px;
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

          .footer-column h3 {
            font-size: 23px;
          }

          .footer-column a {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            width: calc(100% - 28px);
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 25px 0 10px;
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
            margin-bottom: 18px;
          }

          .footer-description {
            font-size: 14px;
            margin-bottom: 18px;
          }

          .footer-email,
          .footer-phone {
            font-size: 16px;
          }

          .footer-address {
            font-size: 12px;
            line-height: 1.5;
          }

          .footer-column {
            width: 100%;
          }

          .footer-column h3 {
            font-size: 21px;
            margin-bottom: 12px;
          }

          .footer-column a {
            font-size: 15px;
            padding-bottom: 10px;
            margin-bottom: 14px;
          }
        }

        @media (max-width: 360px) {
          .footer-container {
            width: calc(100% - 22px);
            padding-top: 22px;
            padding-bottom: 8px;
          }

          .footer-logo {
            width: 155px;
            height: 70px;
          }

          .footer-getprospekt-logo {
            width: 190px;
            max-height: 70px;
          }

          .footer-tagline {
            font-size: 13px;
          }

          .footer-description {
            font-size: 13px;
          }

          .footer-email,
          .footer-phone {
            font-size: 15px;
          }

          .footer-address {
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
