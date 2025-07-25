import fs from 'fs-extra';
import path from 'path';

async function generateSitemap() {
  const keywordData = await fs.readJson(path.join(process.cwd(), 'data/enhanced-keywords.json'));
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/blog'
  ];
  
  const dynamicPages = keywordData.keywords.slice(0, 100).map(keyword => {
    const slug = keyword.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    return `/${slug}`;
  });
  
  const allPages = [...staticPages, ...dynamicPages];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  await fs.writeFile(path.join(process.cwd(), 'public/sitemap.xml'), sitemap);
  console.log(`✅ Generated sitemap with ${allPages.length} pages`);
}

generateSitemap().catch(console.error); 