import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://ccis.skilizee.com';
  
  const routes = [
    '',
    '/about',
    '/academics',
    '/admissions',
    '/campus-life',
    '/faculty',
    '/news-events',
    '/alumni',
    '/contact',
    '/policies',
  ];

  return routes.map((route) => ({
    url: `${origin}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
