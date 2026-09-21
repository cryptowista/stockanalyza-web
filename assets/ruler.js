// Positions the valuation ruler from data attributes. No numbers to compute by hand:
// every mark carries its dollar value in data-value, bands carry data-from / data-to.
(function () {
  document.querySelectorAll(".ruler").forEach(function (ruler) {
    var values = [];
    ruler.querySelectorAll("[data-value]").forEach(function (el) { values.push(parseFloat(el.dataset.value)); });
    ruler.querySelectorAll("[data-to]").forEach(function (el) { values.push(parseFloat(el.dataset.to)); });
    if (!values.length) return;

    var lo = Math.min.apply(null, values);
    var hi = Math.max.apply(null, values);
    var pad = (hi - lo) * 0.12 || 1;
    var min = ruler.dataset.min ? parseFloat(ruler.dataset.min) : lo - pad;
    var max = ruler.dataset.max ? parseFloat(ruler.dataset.max) : hi + pad;
    var pos = function (v) { return Math.max(0, Math.min(100, (v - min) / (max - min) * 100)); };

    ruler.querySelectorAll("[data-value]").forEach(function (el) {
      var x = pos(parseFloat(el.dataset.value));
      el.style.setProperty("--x", x + "%");
      if (x < 14) el.classList.add("edge-start");
      if (x > 86) el.classList.add("edge-end");
    });
    ruler.querySelectorAll("[data-to]").forEach(function (el) {
      var from = el.dataset.from === "start" ? 0 : pos(parseFloat(el.dataset.from));
      el.style.setProperty("--from", from + "%");
      el.style.setProperty("--to", pos(parseFloat(el.dataset.to)) + "%");
    });
    ruler.classList.add("is-ready");
  });
})();
