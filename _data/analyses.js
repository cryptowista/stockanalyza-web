// Collects every analysis from analysis/<ticker>/meta.json, newest first.
// To publish a new analysis, add a folder analysis/<ticker>/ with index.html, index.md and meta.json.
const fs = require("fs");
const path = require("path");

module.exports = function () {
  const dir = path.join(__dirname, "..", "analysis");
  const list = fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, "meta.json")))
    .map((d) => JSON.parse(fs.readFileSync(path.join(dir, d.name, "meta.json"), "utf8")));
  list.sort((a, b) => (b.date.localeCompare(a.date)) || ((b.order || 0) - (a.order || 0)));
  return list;
};
