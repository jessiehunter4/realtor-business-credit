import { useEffect } from "react";

const SITE_URL = "https://realtorbusinesscredit.com";
const DEFAULT_OG = "https://lovable.dev/opengraph-image-p98pqg.png";

type SeoProps = {
  title: string;
  description: string;
  /** Path only, e.g. "/guide". Defaults to current pathname. */
  path?: string;
  ogImage?: string;
  /** JSON-LD object(s) injected as <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

const upsertMeta = (selector: string, attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
};

/**
 * Lightweight SEO head manager. Sets title, meta description, canonical,
 * Open Graph + Twitter tags, and optional JSON-LD per page.
 */
const Seo = ({ title, description, path, ogImage = DEFAULT_OG, jsonLd, noindex }: SeoProps) => {
  useEffect(() => {
    const canonical = `${SITE_URL}${path ?? window.location.pathname}`;
    document.title = title;

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertLink("canonical", canonical);

    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:image"]', "property", "og:image", ogImage);

    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    if (noindex) {
      upsertMeta('meta[name="robots"]', "name", "robots", "noindex,nofollow");
    } else {
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots) robots.remove();
    }

    // JSON-LD
    const tagId = "seo-jsonld";
    document.getElementById(tagId)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = tagId;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(tagId)?.remove();
    };
  }, [title, description, path, ogImage, jsonLd, noindex]);

  return null;
};

export default Seo;