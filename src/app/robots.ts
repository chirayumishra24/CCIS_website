import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://ccis.skilizee.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
