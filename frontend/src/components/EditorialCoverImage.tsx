import React from "react";

export interface EditorialCoverProps {
  title: string;
  subtitle?: string;
  category?: string;
  photo: string;
  variant?: "hero" | "subfeatured" | "side" | "channel" | "articleHero" | "card";
  className?: string;
}

interface BrandConfig {
  name1: string;
  name2: string;
  color: string;
}

function resolveBrand(category = ""): BrandConfig {
  const cat = category.toLowerCase().trim();
  let color = "#0046FC"; // GETprospeKt signature Royal Blue

  if (cat.includes("dev") || cat.includes("software") || cat.includes("code") || cat.includes("iot") || cat.includes("platform") || cat.includes("playbook")) {
    color = "#662E8A"; // Royal Purple
  } else if (cat.includes("martech") || cat.includes("marketing") || cat.includes("data") || cat.includes("abm")) {
    color = "#E60067"; // Vibrant Magenta/Coral
  } else if (cat.includes("fintech") || cat.includes("finance") || cat.includes("banking") || cat.includes("risk") || cat.includes("case") || cat.includes("study")) {
    color = "#00A86B"; // Emerald Green
  } else if (cat.includes("enterprise") || cat.includes("ciso") || cat.includes("cio") || cat.includes("leadership") || cat.includes("buyer")) {
    color = "#E65100"; // Deep Amber/Orange
  } else if (cat.includes("security") || cat.includes("cyber") || cat.includes("threat") || cat.includes("cloud") || cat.includes("soc") || cat.includes("identity") || cat.includes("ai") || cat.includes("trend") || cat.includes("whitepaper") || cat.includes("report")) {
    color = "#0088CC"; // Cyan/Electric Blue
  } else if (cat.includes("event") || cat.includes("webinar")) {
    color = "#0046FC"; // Signature Royal Blue
  }

  // Uniform brand identity: GETprospeKt on all editorial card mastheads
  return { name1: "GET", name2: "prospeKt", color };
}

export const EditorialCoverImage: React.FC<EditorialCoverProps> = ({
  title,
  subtitle,
  category = "",
  photo,
  variant = "hero",
  className = "",
}) => {
  const brand = resolveBrand(category);

  return (
    <>
      <div className={`editorial-card-wrapper variant-${variant} ${className}`}>
        {/* LEFT WHITE EDITORIAL PANEL */}
        <div className="editorial-card-left">
          {/* BRAND LOGO WITH SPEECH BUBBLE ICON */}
          <div className="editorial-card-brand">
            <div className="editorial-card-brand-text">
              <span className="brand-sub">{brand.name1}</span>
              <strong className="brand-main">{brand.name2}</strong>
            </div>
            <div
              className="editorial-card-brand-dot"
              style={{ backgroundColor: brand.color }}
            >
              <div
                className="brand-dot-tail"
                style={{ borderTopColor: brand.color }}
              />
            </div>
          </div>

          {/* ARTICLE HEADLINE */}
          <h3 className="editorial-card-title">{title}</h3>

          {/* ACCENT LINE */}
          <div
            className="editorial-card-line"
            style={{ backgroundColor: brand.color }}
          />

          {/* SUBTITLE (Shown in hero, channel, articleHero) */}
          {subtitle && (
            <p className="editorial-card-subtitle">{subtitle}</p>
          )}
        </div>

        {/* RIGHT SPEECH-BUBBLE CURVED PHOTO */}
        <div className="editorial-card-right">
          {/* OUTER CURVED SILHOUETTE (SPEECH BUBBLE BORDER) */}
          <div
            className="editorial-card-bubble-outer"
            style={{ backgroundColor: brand.color }}
          />

          {/* SPEECH BUBBLE NOTCH AT BOTTOM LEFT */}
          <div
            className="editorial-card-bubble-notch"
            style={{ borderBottomColor: brand.color }}
          />

          {/* INNER PHOTO CLIPPED */}
          <div className="editorial-card-photo-clip">
            <img
              src={photo}
              alt={title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90";
              }}
            />
          </div>
        </div>

        {/* INTERACTIVE HOVER OVERLAY BADGE */}
        <span className="editorial-hover-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Click Image to Open Full Content
        </span>
      </div>

      <style>{`
        /* ====================================================
           EDITORIAL COVER CARD (EXACT REPLICA OF GETprospeKt / TALK DEV)
           ==================================================== */
        .editorial-card-wrapper {
          width: 100%;
          height: 100%;
          min-height: 100%;
          background: #FFFFFF;
          border-radius: 7px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 53% 47%;
          position: relative;
          box-sizing: border-box;
          user-select: none;
        }

        /* LEFT CONTENT PANEL */
        .editorial-card-left {
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          z-index: 2;
          box-sizing: border-box;
        }

        /* BRAND LOGO */
        .editorial-card-brand {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .editorial-card-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-sub {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #0046FC;
          letter-spacing: 1.8px;
        }

        .brand-main {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 21px;
          font-weight: 900;
          color: #111111;
          letter-spacing: -0.5px;
        }

        /* CIRCULAR SPEECH BUBBLE LOGO ICON */
        .editorial-card-brand-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          position: relative;
          margin-left: 2px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .editorial-card-brand-dot::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #FFFFFF;
          border-radius: 50%;
        }

        .brand-dot-tail {
          position: absolute;
          bottom: -3px;
          left: 1px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 6px solid;
          transform: rotate(35deg);
        }

        /* TITLE */
        .editorial-card-title {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 800;
          color: #111111;
          letter-spacing: -0.4px;
        }

        /* ACCENT LINE */
        .editorial-card-line {
          height: 3px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        /* SUBTITLE */
        .editorial-card-subtitle {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-weight: 500;
          color: #262626;
          line-height: 1.45;
        }

        /* RIGHT SPEECH BUBBLE PHOTO */
        .editorial-card-right {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #FFFFFF;
        }

        /* OUTER CURVED SILHOUETTE */
        .editorial-card-bubble-outer {
          position: absolute;
          inset: 0;
          clip-path: ellipse(75% 75% at 85% 50%);
        }

        /* NOTCH AT BOTTOM LEFT */
        .editorial-card-bubble-notch {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 0;
          border-bottom: 42px solid;
          border-right: 50px solid transparent;
          z-index: 1;
        }

        /* PHOTO CLIPPED INSIDE INNER CURVE */
        .editorial-card-photo-clip {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 17%;
          clip-path: ellipse(80% 80% at 90% 50%);
          overflow: hidden;
          background: #000;
        }

        .editorial-card-photo-clip img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }

        .editorial-card-wrapper:hover .editorial-card-photo-clip img {
          transform: scale(1.06);
        }

        /* PROMINENT ACTION PILL (MATCHING SCREENSHOT) */
        .editorial-hover-pill {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: #0052FF;
          color: #FFFFFF;
          border: 1px solid rgba(0, 210, 255, 0.45);
          border-radius: 5px;
          padding: 6px 12px;
          font-size: 11.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          opacity: 0.96;
          z-index: 5;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 82, 255, 0.35);
          transition: all 0.25s ease;
        }

        .editorial-card-wrapper:hover .editorial-hover-pill {
          opacity: 1;
          background: #003ECC;
          border-color: #00D2FF;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 82, 255, 0.5);
        }

        /* ================= VARIANT STYLES ================= */

        /* HERO & ARTICLE HERO */
        .variant-hero .editorial-card-left,
        .variant-articleHero .editorial-card-left {
          padding: 26px 22px 26px 28px;
        }

        .variant-hero .editorial-card-brand,
        .variant-articleHero .editorial-card-brand {
          margin-bottom: 18px;
        }

        .variant-hero .editorial-card-title,
        .variant-articleHero .editorial-card-title {
          font-size: clamp(20px, 2.1vw, 28px);
          line-height: 1.2;
          margin-bottom: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .variant-hero .editorial-card-line,
        .variant-articleHero .editorial-card-line {
          width: 90px;
          margin: 15px 0 14px;
        }

        .variant-hero .editorial-card-subtitle,
        .variant-articleHero .editorial-card-subtitle {
          font-size: clamp(13px, 1.2vw, 15px);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* SUBFEATURED (2X2 GRID) */
        .variant-subfeatured .editorial-card-left {
          padding: 15px 12px 15px 16px;
        }

        .variant-subfeatured .editorial-card-brand {
          margin-bottom: 8px;
        }

        .variant-subfeatured .brand-sub {
          font-size: 9px;
          letter-spacing: 1px;
        }

        .variant-subfeatured .brand-main {
          font-size: 16px;
        }

        .variant-subfeatured .editorial-card-brand-dot {
          width: 17px;
          height: 17px;
        }

        .variant-subfeatured .editorial-card-brand-dot::after {
          width: 6px;
          height: 6px;
        }

        .variant-subfeatured .editorial-card-title {
          font-size: clamp(13px, 1.2vw, 16px);
          line-height: 1.24;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .variant-subfeatured .editorial-card-line {
          width: 60px;
          height: 2.5px;
          margin: 9px 0 0;
        }

        .variant-subfeatured .editorial-card-subtitle {
          display: none;
        }

        .variant-subfeatured .editorial-hover-pill {
          font-size: 10px;
          padding: 3px 6px;
          bottom: 6px;
          left: 6px;
        }

        /* CHANNEL CARD */
        .variant-channel .editorial-card-left {
          padding: 16px 14px 16px 18px;
        }

        .variant-channel .editorial-card-brand {
          margin-bottom: 10px;
        }

        .variant-channel .editorial-card-title {
          font-size: 15px;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .variant-channel .editorial-card-line {
          width: 65px;
          margin: 10px 0;
        }

        .variant-channel .editorial-card-subtitle {
          font-size: 12.5px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* CARD VARIANT (FOR RESOURCES, CASE STUDIES, EVENTS) */
        .variant-card .editorial-card-left {
          padding: 16px 14px 14px 16px;
          justify-content: flex-start;
        }

        .variant-card .editorial-card-brand {
          margin-bottom: 8px;
        }

        .variant-card .brand-sub {
          font-size: 9px;
          letter-spacing: 1px;
        }

        .variant-card .brand-main {
          font-size: 15px;
        }

        .variant-card .editorial-card-brand-dot {
          width: 16px;
          height: 16px;
        }

        .variant-card .editorial-card-brand-dot::after {
          width: 5px;
          height: 5px;
        }

        .variant-card .editorial-card-title {
          font-size: clamp(12.5px, 1.1vw, 14.5px);
          line-height: 1.25;
          margin-bottom: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 800;
        }

        .variant-card .editorial-card-line {
          width: 55px;
          height: 2.5px;
          margin: 7px 0 6px;
        }

        .variant-card .editorial-card-subtitle {
          font-size: 11px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #334155;
        }

        .variant-card .editorial-hover-pill {
          font-size: 10px;
          padding: 4px 8px;
          bottom: 8px;
          left: 8px;
          gap: 4px;
        }

        /* SIDEBAR THUMBNAIL (COMPACT) */
        .variant-side {
          grid-template-columns: 42% 58%;
        }

        .variant-side .editorial-card-left {
          padding: 8px 6px 8px 8px;
          justify-content: center;
        }

        .variant-side .editorial-card-brand {
          margin-bottom: 4px;
        }

        .variant-side .brand-sub {
          font-size: 7px;
          letter-spacing: 0.5px;
        }

        .variant-side .brand-main {
          font-size: 12px;
        }

        .variant-side .editorial-card-brand-dot {
          width: 12px;
          height: 12px;
        }

        .variant-side .editorial-card-brand-dot::after {
          width: 4px;
          height: 4px;
        }

        .variant-side .editorial-card-title {
          font-size: 9.5px;
          line-height: 1.15;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .variant-side .editorial-card-line,
        .variant-side .editorial-card-subtitle,
        .variant-side .editorial-hover-pill {
          display: none;
        }

        .variant-side .editorial-card-bubble-notch {
          border-bottom-width: 20px;
          border-right-width: 25px;
        }

        @media (max-width: 640px) {
          .variant-hero .editorial-card-left,
          .variant-articleHero .editorial-card-left {
            padding: 14px 12px;
          }
          .variant-hero .editorial-card-title,
          .variant-articleHero .editorial-card-title {
            font-size: 15px;
            -webkit-line-clamp: 2;
          }
          .variant-hero .editorial-card-subtitle,
          .variant-articleHero .editorial-card-subtitle {
            font-size: 11px;
            -webkit-line-clamp: 2;
          }
          .variant-hero .editorial-card-line,
          .variant-articleHero .editorial-card-line {
            margin: 7px 0;
            width: 45px;
          }
        }
      `}</style>
    </>
  );
};

export default EditorialCoverImage;
