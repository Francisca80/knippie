# Google instellen voor Knippie

De website is voorbereid. De accounts zijn nog niet gekoppeld. Alle instellingen staan in `dist/config.js`; het uiteindelijke domein, de verificatiecode, de bedrijfsprofiellink en het Analytics-ID zijn nog leeg.

## 1. Google Bedrijfsprofiel

Maak of claim het profiel en rond de verificatie af bij Google. Gebruik dezelfde gegevens als op de website:

- Trimsalon Knippie
- De Richtershof 22, 4184 EW Opijnen
- 06 2399 7163
- Het definitieve webadres van de salon

Vul openingstijden en categorie zelf in op basis van de werkelijke bedrijfsvoering. Deel daarna de Maps-link van het profiel en zet deze bij `mapsUrl` in `dist/config.js`. De website toont dan een locatielink. Bij het uitvoeren van het SEO-script komt de link ook in de statische bedrijfsgegevens (`hasMap`). Het aanmaken en verifiëren van het profiel gebeurt bij Google en kan niet met websitecode worden afgerond.

## 2. Search Console en publiceren

Vul `siteUrl` in `dist/config.js` in met het definitieve HTTPS-domein, zonder extra pad.

Je kunt in Search Console kiezen voor een domeinproperty (verificatie met DNS bij de domeinbeheerder) of een URL-prefixproperty. Voor de HTML-tagmethode van een URL-prefixproperty zet je uitsluitend de waarde uit `content="..."` in `searchConsoleVerification`. Bij DNS-verificatie blijft dit veld leeg.

Voer vanuit de map `knippie` uit:

```sh
node configure-seo.mjs
```

Dit zet de website klaar voor indexering en schrijft canonical, Open Graph-tags, bedrijfsgegevens, robots.txt en sitemap.xml. De verificatietag wordt in de oorspronkelijke HTML gezet, niet pas via JavaScript. Een bestaande verificatiecode blijft behouden bij opnieuw uitvoeren zonder nieuwe code.

Upload daarna de inhoud van `dist` naar de hosting. Rond de verificatie in Search Console af en dien `sitemap.xml` in. Gebruik URL-inspectie om de gepubliceerde homepage te controleren. Totdat het script voor het echte domein is uitgevoerd, blijft de huidige conceptversie op `noindex` en blokkeert robots.txt crawlen.

## 3. Google Analytics 4

Maak een GA4-property met een webgegevensstream voor de website. Zet het meet-ID (`G-...`) in `analyticsId` in `dist/config.js` en upload dat bestand. Voeg geen tweede Analytics-script of Tag Manager-container toe; de website laadt de tag zelf.

Zonder geldig ID is Analytics uit. Met een geldig ID verschijnt de cookiekeuze. De Google-tag wordt pas geladen nadat de bezoeker statistieken accepteert. Advertentietoestemming staat uit. Via ‘Cookiekeuze’ in de footer kan de bezoeker de keuze wijzigen. Weigeren na eerdere toestemming verwijdert de Analytics-cookies en herlaadt de pagina.

De website verstuurt na toestemming `contact_click` met:

| Parameter | Waarden |
| --- | --- |
| `contact_method` | `phone`, `whatsapp`, `facebook`, `email`, `maps` |
| `placement` | `header`, `hero`, `contact`, `other` |

Registreer deze twee parameters in GA4 als aangepaste dimensies met gebeurtenisbereik om ze in rapporten te gebruiken. Deze meting telt klikken; ze bewijst niet dat iemand heeft gebeld, een bericht heeft verstuurd of een afspraak heeft gemaakt. De eigen contactgebeurtenis verstuurt geen telefoonnummer, berichtinhoud of volledige link.

Controleer de instellingen voor verbeterde meting. Zet uitgaande klikmeting uit als je alleen de eigen contactmeting wilt en geen automatische events met volledige uitgaande links. Schakel formulierinteracties uit als die niet nodig zijn.

## 4. Controle na publiceren

1. Controleer in de paginabron het echte domein, canonical, `index, follow` en eventueel `google-site-verification`.
2. Open `/robots.txt` en `/sitemap.xml` op het echte domein.
3. Test in een privévenster: vóór toestemming en na weigeren mogen geen Analytics-verzoeken worden verzonden.
4. Accepteer statistieken en controleer de pageview in GA4 Realtime. Klik op telefoon, WhatsApp en Facebook en controleer `contact_click`.
5. Trek de toestemming in via Cookiekeuze; controleer na herladen dat Analytics uitblijft.
6. Controleer het mobiele contactblok en de Google Maps-link.

Lokaal zijn de SEO-generatie en de toestemmingslogica met gesimuleerde browserobjecten gecontroleerd. De live Google-ontvangst en verificatie moeten na het koppelen worden gecontroleerd.

## Google-documentatie

- [Bedrijfsprofiel toevoegen of claimen](https://support.google.com/business/answer/2911778)
- [Search Console-eigendom verifiëren](https://support.google.com/webmasters/answer/9008080)
- [Toestemmingsmodus](https://developers.google.com/tag-platform/security/guides/consent)
- [GA4-gebeurtenisparameters](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters)
