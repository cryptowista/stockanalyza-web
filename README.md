# stockanalyza.com

Statický web pro free analýzy Stock Analyza, postavený v Eleventy (11ty). Netlify při každém commitu spustí `npm run build` a publikuje složku `_site` (viz `netlify.toml`).

## Struktura
- `analysis/<ticker>/index.html` – článek (kopíruje se beze změny)
- `analysis/<ticker>/index.md` – markdown verze článku pro AI
- `analysis/<ticker>/meta.json` – údaje pro úvodní stránku, sitemap, llms.txt a _headers
- `index.njk` – šablona úvodní stránky (blok LATEST a tabulka se generují z meta.json)
- `sitemap.njk`, `llms.njk`, `headers.njk` – šablony generovaných souborů
- `_data/analyses.js` – načte všechny meta.json, seřadí od nejnovější
- `about/`, `assets/`, favicony, `404.html`, `robots.txt`, `og-default.jpg` – kopírují se beze změny
- `netlify/edge-functions/markdown.js` – markdown pro agenty přes Accept: text/markdown

## Nová analýza
1. Vytvoř složku `analysis/<ticker>/` (malá písmena) se třemi soubory: `index.html`, `index.md`, `meta.json`.
2. Commit. Úvodní stránka, tabulka, sitemap, llms.txt a _headers se vygenerují samy.
3. V Search Console požádej o indexaci nové URL.

### meta.json
- `ticker`, `slug`, `name` (např. "Ouster (OUST)"), `company`, `companyShort`
- `date` (YYYY-MM-DD), `order` (vyšší = novější v rámci stejného dne)
- `verdict` (buy / hold / sell), `verdictLabel` (Hold, Reduce, Sell…), `call` (HTML řádku verdiktu)
- `price`, `base`, `upside` (číslo jako text, např. "-38.9"), `upsideText`, `maxBuy`
- `teaser` (text do bloku LATEST), `ruler` (HTML pravítka), `llms` (popis do llms.txt)

## Lokální náhled (volitelné)
```
npm install
npm start
```
Web poběží na http://localhost:8080.
