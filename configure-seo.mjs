// Na het invullen van dist/config.js: node configure-seo.mjs
// Of: node configure-seo.mjs https://jouw-domein.nl [Search-Console-verificatietoken]
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const context = { window: {} };
runInNewContext(readFileSync(new URL('./dist/config.js', import.meta.url), 'utf8'), context);
const config = context.window.KNIPPIE_CONFIG || {};
const siteUrl = process.argv[2] || config.siteUrl;
if (!siteUrl) throw new Error('Vul siteUrl in dist/config.js in of geef het HTTPS-domein als argument mee.');
const url = new URL(siteUrl);
if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Gebruik een HTTPS-domein zonder pad, query of fragment.');
const origin = url.origin + '/';
const token = process.argv[3] || config.searchConsoleVerification;
let mapsUrl;
if (config.mapsUrl) {
  mapsUrl = new URL(config.mapsUrl);
  if (mapsUrl.protocol !== 'https:' || mapsUrl.username || mapsUrl.password) throw new Error('Gebruik een geldige HTTPS-link voor het Google Bedrijfsprofiel.');
}
const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
const file = new URL('./dist/index.html', import.meta.url);
let html = readFileSync(file, 'utf8');
if (!html.includes('<!-- PUBLIC_SEO_START -->') || !html.includes('id="business-schema"')) throw new Error('SEO-markeringen ontbreken in index.html.');
const tags = [
  '<meta name="robots" content="index, follow, max-image-preview:large">',
  `<link rel="canonical" href="${escape(origin)}">`,
  `<meta property="og:url" content="${escape(origin)}">`,
  `<meta property="og:image" content="${escape(origin)}assets/salon-opijnen.jpg">`,
  '<meta property="og:image:alt" content="Trimsalon Knippie in Opijnen">'
];
// Behoud een bestaande verificatie als geen nieuwe code is opgegeven.
const existingVerification = html.match(/<meta name="google-site-verification" content="[^"]*">/);
if (token) tags.push(`<meta name="google-site-verification" content="${escape(token)}">`);
else if (existingVerification) tags.push(existingVerification[0]);
html = html.replace(/<!-- PUBLIC_SEO_START -->[\s\S]*?<!-- PUBLIC_SEO_END -->/, `<!-- PUBLIC_SEO_START -->\n  ${tags.join('\n  ')}\n  <!-- PUBLIC_SEO_END -->`);
html = html.replace(/(<script type="application\/ld\+json" id="business-schema">)(.*?)(<\/script>)/, (_, start, json, end) => {
  const data = JSON.parse(json);
  data.url = origin;
  data['@id'] = origin + '#salon';
  data.image = [origin + 'assets/salon-opijnen.jpg', origin + 'assets/bianca_knippie.jpg'];
  data.logo = origin + 'assets/knippie-logo.svg';
  if (config.phone) data.telephone = config.phone;
  if (config.email) data.email = config.email; else delete data.email;
  if (config.streetAddress) data.address.streetAddress = config.streetAddress;
  if (config.postalCode) data.address.postalCode = config.postalCode;
  if (mapsUrl) data.hasMap = mapsUrl.href; else delete data.hasMap;
  return start + JSON.stringify(data).replaceAll('<', '\\u003c') + end;
});
writeFileSync(file, html);
writeFileSync(new URL('./dist/robots.txt', import.meta.url), `User-agent: *\nAllow: /\nSitemap: ${origin}sitemap.xml\n`);
writeFileSync(new URL('./dist/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(origin)}</loc></url></urlset>\n`);
console.log('Publieke SEO-bestanden gereed voor', origin, 'Upload dist om deze wijzigingen te publiceren.');
