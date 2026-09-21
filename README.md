# stockanalyza.com

Statický web pro free analýzy Stock Analyza. Žádný build, Netlify publikuje kořen repozitáře (viz `netlify.toml`).

## Struktura
- `index.html` – úvodní stránka: hero, nejnovější analýza s pravítkem, tabulka všech analýz
- `analysis/<ticker>/index.html` – jedna analýza = jedna složka (URL `/analysis/mitt/`)
- `about/index.html` – metodika a disclaimer
- `assets/styles.css`, `assets/ruler.js` – sdílený vzhled a pravítko ocenění
- `sitemap.xml`, `robots.txt`, `404.html`, favicony z loga, `og-default.jpg` (náhled pro X/FB, výřez z banneru)
- `llms.txt`, `robots.txt` (Content Signals, AI crawlery), `_headers` (Link hlavičky, typy), `netlify/edge-functions/markdown.js` (markdown pro agenty přes Accept: text/markdown)
- `*/index.md` – markdown verze každé stránky
- `assets/img/` – logo a banner z Patreonu (webp + jpg)

## Nová analýza (checklist)
1. Zkopíruj `analysis/mitt/` do `analysis/<ticker>/` (malá písmena).
2. V `<head>` přepiš: title, meta description (max ~155 znaků), canonical, og:*, JSON-LD (headline, datumy, URL, tickerSymbol).
3. Verdict panel: `data-verdict="buy|hold|sell"`, text verdiktu, key figures.
4. Pravítko: jen dolarové hodnoty do `data-value` (bear/base/bull tick, cena), `data-from/data-to` (pásmo bear–bull), buy zóna `data-from="start" data-to="<max buy>"`. Pozice se dopočítají samy.
5. Text článku: nadpisy `h2` ve větném tvaru (ne VERZÁLKY), bez pomlček.
6. `index.html`: nahraď blok LATEST a přidej řádek nahoru do tabulky.
7. `sitemap.xml`: přidej URL s `lastmod`, aktualizuj `lastmod` u `/`.
8. `analysis/<ticker>/index.md` – markdown verze článku (připraví Claude).
9. `llms.txt`: přidej řádek do sekce Analyses. `_headers`: přidej blok s `rel="alternate"` pro novou URL. V `<head>` článku uprav `<link rel="alternate" type="text/markdown">`.
10. Commit + push → Netlify nasadí. Pak v Search Console „Kontrola adresy URL“ → Požádat o indexaci.

## Kontrola AI readiness po nasazení
```
curl -H "Accept: text/markdown" https://stockanalyza.com/analysis/mitt/ -i
```
Očekávej `Content-Type: text/markdown` a `X-Markdown-Source: /analysis/mitt/index.md`.
