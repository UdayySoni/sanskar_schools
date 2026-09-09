import { useEffect } from "react";
import siteConfig from "../../site.config.json";

const BRAND = "Sanskar Public School Mathura";
const SITE_URL = siteConfig.url;

export function usePageMeta({
  title,
  description,
  keywords = "",
  path = "/",
  image = "/optimized/building01.jpg",
  schema,
}: {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}) {
  const schemaJson = schema ? JSON.stringify(schema) : "";
  useEffect(() => {
    let active = true;
    const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path}`;
    const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    const applyMetadata = (pageTitle: string, pageDescription: string) => {
      const fullTitle = pageTitle.toLowerCase().includes("sanskar") ? pageTitle : `${pageTitle} | ${BRAND}`;
      document.title = fullTitle;
      setMeta("name", "description", pageDescription);
      setMeta("property", "og:title", fullTitle);
      setMeta("property", "og:description", pageDescription);
      setMeta("name", "twitter:title", fullTitle);
      setMeta("name", "twitter:description", pageDescription);
    };

    applyMetadata(title, description);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", "index, follow, max-image-preview:large");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", BRAND);
    setMeta("property", "og:locale", "en_IN");
    setMeta("property", "og:image", imageUrl);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:image", imageUrl);
    setLink("canonical", canonicalUrl);

    const oldSchema = document.getElementById("page-schema");
    oldSchema?.remove();
    if (schemaJson) {
      const script = document.createElement("script");
      script.id = "page-schema";
      script.type = "application/ld+json";
      script.textContent = schemaJson;
      document.head.appendChild(script);
    }

    fetch("/api/content")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        const override = payload?.content?.seo?.[path];
        if (active && override?.title && override?.description) {
          applyMetadata(override.title, override.description);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [title, description, keywords, path, image, schemaJson]);
}

function setMeta(attrType: "name" | "property", attrName: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attrType}="${attrName}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrType, attrName);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}
