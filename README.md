# Trimsalon Knippie

Statische Nederlandse onepage, zonder framework, packages of buildstap. Open `dist/index.html` in de browser, of serveer `dist` met een lokale webserver. Upload alleen de inhoud van `dist` naar je webhosting.

## Inhoud

`dist/index.html` bevat de teksten, semantische HTML en LocalBusiness JSON-LD. `styles.css` bevat de responsive vormgeving; `script.js` regelt het mobiele menu, privacyvenster, contactlinks en de cookiekeuze. `config.js` bevat de nog aan te vullen bedrijfsgegevens en het Analytics-ID.

Bevestigd: Trimsalon Knippie, Bianca Rademacher, De Richtershof 22, 4184 EW Opijnen, KvK 42050237, telefoon en WhatsApp 06 2399 7163, ‘Van knip naar knap’. Dienstenbeschrijvingen en algemene teksten zijn conceptcopy en moeten door Bianca worden gecontroleerd. Er zijn geen tarieven, openingstijden, diploma's of beoordelingen verzonnen. De hondenfoto is een sfeerfoto, geen klantfoto.

## Voor publieke ingebruikname

1. Vul e-mail en eventueel de juiste Google Maps-link in `dist/config.js` in. Voeg openingstijden pas toe wanneer bevestigd, zowel zichtbaar als in JSON-LD.
2. Laat Bianca teksten en privacy-informatie controleren en aanvullen. Bevestig het aanbod en publiceer volledige contactgegevens.
3. Voer `node configure-seo.mjs https://jouw-domein.nl` uit met het echte domein. Optioneel kan als tweede argument het Google Search Console-verificatietoken mee. Dit genereert canonical, `og:url`, sitemap en publieke robotsregels. De privéconceptversie staat bewust op **noindex**; voor Google-vindbaarheid moet de productieversie ook zonder inloggen bereikbaar zijn.
4. Vul het GA4-meet-ID (`G-...`) in `dist/config.js` in. Zonder geldig ID is Analytics uitgeschakeld en verschijnt geen cookieverzoek. Google wordt pas geladen na expliciete toestemming. Advertentietoestemming blijft geweigerd. Keuzes verlopen na 180 dagen; intrekken verwijdert `_ga`-cookies en herlaadt de pagina. Controleer de uiteindelijke configuratie met Google Tag Assistant. Schakel automatische formulierinteractiemetingen uit als later formulieren met persoonsgegevens worden toegevoegd.
5. Verifieer het domein in Google Search Console en dien `sitemap.xml` in. Controleer de structured data met de Rich Results Test. Maak of verifieer het Google Bedrijfsprofiel afzonderlijk en houd naam, adres en telefoonnummer gelijk. Er is nog geen Google-account gekoppeld of profiel aangemaakt.

## SEO / GEO

Nederlandse titel en beschrijving, lokale verwijzingen naar Opijnen, toegankelijke koppen, direct leesbare HTML, concrete FAQ-antwoorden en gestructureerde bedrijfsgegevens ondersteunen zoekmachines en AI-zoekdiensten. Het volledige adres en KvK-nummer zijn opgenomen. Exacte coördinaten zijn niet ingevuld; deze zijn nog niet geverifieerd. Vindbaarheid en opname in AI-antwoorden zijn niet gegarandeerd.

Implementatiebronnen: [Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent), [Google LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## Foto

Ramiro Pianarosa / Unsplash: https://unsplash.com/photos/a-small-dog-looking-up-pRhZHhixRIY — https://unsplash.com/license. Lokaal opgeslagen en verkleind. Er zijn geen externe fonts, embeds of afbeeldingsverzoeken bij het openen van de pagina.

## Logo

Het aangeleverde `Knippie_pink.ai` is met pdftocairo naar `dist/assets/knippie-logo.svg` geconverteerd. De originele vectorvormen zijn behouden; het logo is niet nagetekend.

De door de eigenaar aangeleverde salonfoto staat lokaal als `dist/assets/salon-opijnen.jpg` en toont de ingang in Opijnen. Het kleurenschema gebruikt logo-roze en neutrale donkere tekst.
