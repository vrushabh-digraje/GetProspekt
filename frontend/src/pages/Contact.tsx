import { useState } from "react";
import { enquiriesApi } from "../services/api";

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("General Enquiry");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await enquiriesApi.submit({
        firstName,
        lastName,
        email,
        company,
        subject,
        message,
      });

      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setCompany("");
      setSubject("General Enquiry");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-container">
          <p className="contact-eyebrow">GET IN TOUCH</p>
          <h1>Contact Us</h1>
          <p className="contact-intro">
            Have a question, partnership idea, media enquiry, or want to
            connect with our team? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-container contact-grid">
          <div className="contact-info">
            <div className="section-title">
              <h2>Let’s Connect</h2>
              <span />
            </div>

            <p className="info-intro">
              Reach out to GETprospeKt for business enquiries, partnerships, lead generation solutions, and general enquiries.
            </p>

            <div className="info-cards">
              <article className="info-card">
                <div className="info-icon">@</div>
                <div>
                  <h3>Email</h3>
                  <p>For general enquiries and business conversations.</p>
                  <a href="mailto:kalpesh@getprospekt.co">kalpesh@getprospekt.co</a>
                </div>
              </article>

              <article className="info-card">
                <div className="info-icon">M</div>
                <div>
                  <h3>Media & Editorial</h3>
                  <p>
                    Connect with GETprospeKt for business opportunities, campaign discussions, and general enquiries.
                  </p>
                  <a href="mailto:kalpesh@getprospekt.co">kalpesh@getprospekt.co</a>
                </div>
              </article>

              <article className="info-card">
                <div className="info-icon">P</div>
                <div>
                  <h3>Partnerships</h3>
                  <p>
                    Interested in working with GETprospeKt or exploring a partnership?
                  </p>
                  <a href="mailto:kalpesh@getprospekt.co">
                    kalpesh@getprospekt.co
                  </a>
                </div>
              </article>

              <article className="info-card">
                <div className="info-icon">M</div>
                <div>
                  <h3>Mobile</h3>
                  <p>For direct business enquiries and assistance.</p>
                  <a href="tel:9904150300">9904150300</a>
                </div>
              </article>
            </div>

            <div className="contact-note">
              <h3>What can we help with?</h3>
              <p>
                Lead generation enquiries, partnerships, campaign discussions, business opportunities, and general questions.
              </p>
              <p style={{ marginTop: "12px" }}>
                <strong>Address:</strong> 03 FLOOR F: NO 301 O WINGLAKESIDE PALAVA KHONI,
                THANE KALYAN, THANE 421204, MAHARASHTRA, INDIA
              </p>
            </div>
          </div>

          <div className="contact-form-wrap">
            <div className="section-title">
              <h2>Send Us a Message</h2>
              <span />
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  <span>First Name *</span>
                  <input
                    required
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>

                <label>
                  <span>Last Name *</span>
                  <input
                    required
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>

              <label>
                <span>Email Address *</span>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label>
                <span>Company</span>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>

              <label>
                <span>Subject</span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option>General Enquiry</option>
                  <option>Business Enquiry</option>
                  <option>Partnership</option>
                  <option>Lead Generation Services</option>
                </select>
              </label>

              <label>
                <span>Message *</span>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us how we can help..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>

              {error && <p className="error-message" style={{ color: "#e11d48", marginTop: "10px" }}>{error}</p>}

              {submitted && (
                <p className="success-message">
                  Thanks for reaching out. Your enquiry has been received and sent to our team!
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <style>{`
        .contact-page {
          width: 100%;
          min-height: 700px;
          background: #fff;
          color: #17182B;
          font-family: var(--font-sans);
        }

        .contact-container {
          width: min(1260px, calc(100% - 50px));
          margin: 0 auto;
        }

        .contact-hero {
          background: #F3F4FF;
          border-bottom: 1px solid #DDDFF0;
          padding: 58px 0 54px;
        }

        .contact-eyebrow {
          margin: 0 0 12px;
          color: #6A63E8;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .contact-hero h1 {
          margin: 0 0 15px;
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1;
          font-weight: 700;
        }

        .contact-intro {
          max-width: 700px;
          margin: 0;
          color: #5D5F73;
          font-size: 18px;
          line-height: 1.6;
        }

        .contact-main {
          padding: 52px 0 70px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(420px, .8fr);
          gap: 70px;
          align-items: start;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 24px;
        }

        .section-title h2 {
          margin: 0;
          color: #6A63E8;
          font-size: 27px;
          line-height: 1.1;
          font-weight: 700;
          white-space: nowrap;
        }

        .section-title span {
          flex: 1;
          height: 1px;
          background: #CCCEE0;
        }

        .info-intro {
          max-width: 650px;
          margin: 0 0 30px;
          color: #4A4B5E;
          font-size: 16px;
          line-height: 1.6;
        }

        .info-cards {
          display: grid;
          gap: 15px;
        }

        .info-card {
          display: flex;
          gap: 18px;
          padding: 22px;
          border: 1px solid #E1E3F0;
          border-radius: 7px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(0, 0, 0, .07);
        }

        .info-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #6A63E8;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .info-card h3 {
          margin: 0 0 6px;
          font-size: 19px;
        }

        .info-card p {
          margin: 0 0 8px;
          color: #6A6C80;
          font-size: 14px;
          line-height: 1.45;
        }

        .info-card a {
          color: #6A63E8;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
        }

        .info-card a:hover {
          text-decoration: underline;
        }

        .contact-note {
          margin-top: 30px;
          padding: 22px 24px;
          border-left: 4px solid #6A63E8;
          background: #F3F4FF;
        }

        .contact-note h3 {
          margin: 0 0 7px;
          font-size: 19px;
        }

        .contact-note p {
          margin: 0;
          color: #5D5F73;
          font-size: 15px;
          line-height: 1.55;
        }

        .contact-form-wrap {
          min-width: 0;
        }

        .contact-form {
          padding: 27px;
          border: 1px solid #D9DBEA;
          background: #fff;
          box-shadow: 0 3px 15px rgba(0, 0, 0, .06);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .contact-form label {
          display: block;
          margin-bottom: 17px;
        }

        .contact-form label > span {
          display: block;
          margin-bottom: 7px;
          color: #27283C;
          font-size: 14px;
          font-weight: 600;
        }

        .contact-form input,
        .contact-form select,
        .contact-form textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #D6DAEA;
          border-radius: 5px;
          background: #fff;
          color: #38394C;
          outline: none;
          padding: 12px 13px;
          font-family: var(--font-sans);
          font-size: 15px;
        }

        .contact-form input,
        .contact-form select {
          height: 45px;
        }

        .contact-form textarea {
          min-height: 135px;
          resize: vertical;
        }

        .contact-form input:focus,
        .contact-form select:focus,
        .contact-form textarea:focus {
          border-color: #6A63E8;
          box-shadow: 0 0 0 2px rgba(20, 125, 187, .08);
        }

        .contact-form button {
          min-width: 150px;
          height: 45px;
          padding: 0 24px;
          border: 0;
          border-radius: 5px;
          background: #6A63E8;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .contact-form button:hover {
          background: #5049C8;
        }

        .success-message {
          margin: 14px 0 0;
          color: #6A63E8;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 45px;
          }
        }

        @media (max-width: 600px) {
          .contact-container {
            width: calc(100% - 28px);
          }

          .contact-hero {
            padding: 40px 0;
          }

          .contact-intro {
            font-size: 16px;
          }

          .contact-main {
            padding: 35px 0 50px;
          }

          .section-title h2 {
            font-size: 23px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .contact-form {
            padding: 20px;
          }

          .info-card {
            padding: 17px;
          }
        }

        @media (max-width: 400px) {
          .contact-hero h1 {
            font-size: 38px;
          }

          .contact-form {
            padding: 16px;
          }

          .info-card {
            gap: 12px;
          }

          .info-icon {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
          }
        }
      `}</style>
    </main>
  );
}

export default Contact;
