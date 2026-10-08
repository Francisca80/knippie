// Eenmalig uitvoeren zodra het definitieve publieke domein bekend is:
// node configure-seo.mjs https://jouw-domein.nl [Search-Console-verificatietoken]
import { readFileSync, writeFileSync } from 'node:fs';
const url = new URL(process.argv[2]);
if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Gebruik een HTTPS-domein zonder pad, query of fragment.');
const origin = url.origin + '/';
const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
const file = new URL('./dist/index.html', import.meta.url);
let html = readFileSync(file, 'utf8');
const tags = ['<meta name="robots" content="index, follow, max-image-preview:large">', `<link rel="canonical" href="${escape(origin)}">`, `<meta property="og:url" content="${escape(origin)}">`];
if (process.argv[3]) tags.push(`<meta name="google-site-verification" content="${escape(process.argv[3])}">`);
html = html.replace(/<!-- PUBLIC_SEO_START -->[\s\S]*?<!-- PUBLIC_SEO_END -->/, `<!-- PUBLIC_SEO_START -->\n  ${tags.join('\n  ')}\n  <!-- PUBLIC_SEO_END -->`);
html = html.replace(/(<script type="application\/ld\+json" id="business-schema">)(.*?)(<\/script>)/, (_, start, json, end) => { const data = JSON.parse(json); data.url = origin; data['@id'] = origin + '#salon'; return start + JSON.stringify(data).replaceAll('<', '\\u003c') + end; });
writeFileSync(file, html);
writeFileSync(new URL('./dist/robots.txt', import.meta.url), `User-agent: *\nAllow: /\nSitemap: ${origin}sitemap.xml\n`);
writeFileSync(new URL('./dist/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(origin)}</loc></url></urlset>\n`);
console.log('Canonical, structured data, robots.txt en sitemap bijgewerkt voor', origin);
