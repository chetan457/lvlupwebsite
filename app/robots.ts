import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

/** Nothing on a four-page shopfront is worth hiding from a crawler. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
