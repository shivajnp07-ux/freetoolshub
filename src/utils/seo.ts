export interface SeoData {
  title: string;
  description: string;
  path?: string;
}

const SITE_NAME = 'FreeToolsHub';
const SITE_URL = 'https://freetoolshub.com';
const DEFAULT_DESCRIPTION =
  'Free online tools for everyone — PDF, image, developer, business, calculators and productivity tools. Fast, private and no signup required.';

export function setSeo({ title, description, path }: SeoData): void {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  document.title = fullTitle;

  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('name', 'twitter:card', 'summary');
  setMetaTag('name', 'twitter:title', fullTitle);
  setMetaTag('name', 'twitter:description', description);

  const canonicalUrl = path ? `${SITE_URL}${path}` : SITE_URL;
  setLinkTag('canonical', canonicalUrl);
  setMetaTag('property', 'og:url', canonicalUrl);
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string): void {
  let tag = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

export { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION };
