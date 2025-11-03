// create this so that user can easily add meta data for
interface MetaTags {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  }
  
  export function setMeta(meta: MetaTags) {
    if (meta.title) {
      document.title = meta.title;
      setMetaTag('og:title', meta.title);
      setMetaTag('twitter:title', meta.title);
    }
  
    if (meta.description) {
      setMetaTag('og:description', meta.description);
      setMetaTag('twitter:description', meta.description);
    }
  
    if (meta.image) {
      setMetaTag('og:image', meta.image);
      setMetaTag('twitter:image', meta.image);
    }
  
    if (meta.url) {
      setMetaTag('og:url', meta.url);
    }
  
    setMetaTag('og:type', meta.type || 'website');
  }
  
  function setMetaTag(property: string, content: string) {
    const selector = property.startsWith('twitter:')
      ? `meta[name="${property}"]`
      : `meta[property="${property}"]`;
  
    let tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      if (property.startsWith('twitter:')) tag.setAttribute('name', property);
      else tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }
  