// Eleventy config for stockanalyza.com
// Articles (analysis/*/index.html and index.md) are copied as they are.
// The homepage, sitemap.xml, llms.txt and _headers are generated from analysis/*/meta.json.
module.exports = function (eleventyConfig) {
  const copy = [
    "analysis/**/*.html", "analysis/**/*.md", "about", "assets",
    "404.html", "robots.txt", "og-default.jpg", "apple-touch-icon.png",
    "favicon-32.png", "favicon-48.png"
  ];
  copy.forEach((p) => eleventyConfig.addPassthroughCopy(p));

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return { y, m, d }; };
  eleventyConfig.addFilter("longDate", (s) => { const { y, m, d } = parse(s); return `${months[m - 1]} ${d}, ${y}`; });
  eleventyConfig.addFilter("shortDate", (s) => { const { y, m, d } = parse(s); return `${months[m - 1].slice(0, 3)} ${d}, ${y}`; });

  return {
    templateFormats: ["njk"],
    dir: { input: ".", output: "_site", data: "_data" }
  };
};
