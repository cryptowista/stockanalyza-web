// Markdown negotiation for stockanalyza.com
//
// When a client explicitly asks for text/markdown in the Accept header and
// prefers it over HTML, return the markdown version of the page instead:
//   /                 -> /llms.txt
//   /analysis/mitt/   -> /analysis/mitt/index.md
//   /about/           -> /about/index.md
// Browsers keep getting normal HTML.
//
// Decided by q-values per RFC 9110. Markdown must be listed explicitly,
// the */* wildcard is not enough, otherwise curl would get markdown too.

function qValue(accept, type, allowWildcard) {
  let best = -1;
  for (const part of accept.split(",")) {
    const [rawType, ...params] = part.trim().split(";");
    const candidate = rawType.trim().toLowerCase();
    if (!candidate) continue;

    const [main] = type.split("/");
    const match =
      candidate === type ||
      (allowWildcard && (candidate === `${main}/*` || candidate === "*/*"));
    if (!match) continue;

    let q = 1;
    for (const p of params) {
      const m = p.trim().match(/^q=([0-9.]+)$/i);
      if (m) q = parseFloat(m[1]);
    }
    if (q > best) best = q;
  }
  return best;
}

function markdownPath(pathname) {
  if (pathname === "/" || pathname === "/index.html") return "/llms.txt";
  if (pathname.endsWith("/index.html")) return pathname.replace(/index\.html$/, "index.md");
  if (pathname.endsWith("/")) return pathname + "index.md";
  if (!pathname.includes(".")) return pathname + "/index.md";
  return null;
}

export default async (request, context) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return context.next();
  }

  const accept = request.headers.get("accept") || "";
  const qMarkdown = qValue(accept, "text/markdown", false); // explicit only
  const qHtml = qValue(accept, "text/html", true);          // also via */*

  if (qMarkdown <= 0 || qMarkdown <= qHtml) {
    return context.next();
  }

  const url = new URL(request.url);
  const mdPath = markdownPath(url.pathname);
  if (!mdPath) return context.next();

  const response = await fetch(new URL(mdPath, request.url));
  if (!response.ok) return context.next();

  const text = await response.text();
  const headers = {
    "Content-Type": "text/markdown; charset=utf-8",
    "Content-Language": "en",
    "Vary": "Accept",
    "Cache-Control": "public, max-age=3600",
    "Access-Control-Allow-Origin": "*",
    "Link": '</llms.txt>; rel="service-doc"; type="text/markdown"',
    "X-Markdown-Source": mdPath,
  };

  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }
  return new Response(text, { status: 200, headers });
};

export const config = {
  path: ["/", "/index.html", "/analysis/*", "/about", "/about/", "/about/index.html"],
  excludedPath: ["/*.md", "/*.txt", "/assets/*"],
};
