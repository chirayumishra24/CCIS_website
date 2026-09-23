import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://ccis.skilizee.com';
  const now = new Date();

  const routes: {
    path: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }[] = [
    // Homepage — highest priority
    { path: '', changeFrequency: 'daily', priority: 1.0 },

    // Core academic & admissions pages
    { path: '/about', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/admissions', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/faculty', changeFrequency: 'monthly', priority: 0.8 },

    // Community & campus pages
    { path: '/campus-life', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/news-events', changeFrequency: 'daily', priority: 0.8 },
    { path: '/alumni', changeFrequency: 'monthly', priority: 0.7 },

    // Utility pages
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/policies', changeFrequency: 'yearly', priority: 0.4 },
  ];

  return routes.map((route) => ({
    url: `${origin}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
