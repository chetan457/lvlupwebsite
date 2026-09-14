import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

/**
 * Four routes, so the file is written out rather than derived. Priorities are
 * relative to each other only: pricing sits level with the home page because
 * "how much is it" is the query most of this site's traffic arrives on.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${site.url}/pricing`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${site.url}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${site.url}/contact`,
      lastModified,
      // hours and the phone number change more often than the prose does
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
