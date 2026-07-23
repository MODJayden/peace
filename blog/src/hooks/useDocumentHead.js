import { useEffect } from "react";

const setMetaTag = (attr, key, content) => {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLinkTag = (rel, href) => {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const setJsonLd = (id, data) => {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

/**
 * Sets page-level SEO metadata (title, description, OG/Twitter cards, canonical,
 * and optional JSON-LD structured data) directly on document.head.
 * This is a client-rendered SPA, so this covers on-page SEO signals for
 * crawlers that execute JS; server-rendered meta would require an SSR layer.
 */
export function useDocumentHead({
  title,
  description,
  image,
  canonical,
  noIndex = false,
  structuredData,
} = {}) {
  useEffect(() => {
    const siteName = "SirPeace";
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Ghana's Premium Digital Newsroom`;

    document.title = fullTitle;
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:type", "article");
    setMetaTag("property", "og:site_name", siteName);

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);

    if (canonical) setLinkTag("canonical", canonical);

    if (structuredData) {
      Object.entries(structuredData).forEach(([key, value]) => {
        setJsonLd(`ld-${key}`, value);
      });
    }

    return () => {
      if (structuredData) {
        Object.keys(structuredData).forEach((key) => setJsonLd(`ld-${key}`, null));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, canonical, noIndex, structuredData]);
}
