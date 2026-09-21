// Filters and sorts the "All analyses" table. Plain JS, no dependencies.
// Rows stay in the HTML for search engines; this only hides them in the browser.
(function () {
  var bar = document.querySelector("[data-filter]");
  var table = document.querySelector("[data-list]");
  if (!bar || !table) return;

  var tbody = table.tBodies[0];
  var rows = Array.prototype.slice.call(tbody.rows);
  var input = bar.querySelector("input");
  var chips = Array.prototype.slice.call(bar.querySelectorAll("[data-v]"));
  var status = bar.querySelector(".filter-status");
  var verdict = "all";

  var fold = function (s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  rows.forEach(function (r) {
    r._text = fold(r.dataset.ticker + " " + r.dataset.company);
  });

  // Counts per verdict
  chips.forEach(function (c) {
    var v = c.dataset.v;
    var n = v === "all" ? rows.length : rows.filter(function (r) { return r.dataset.verdict === v; }).length;
    c.querySelector(".count").textContent = n;
    if (n === 0 && v !== "all") c.disabled = true;
  });

  var empty = document.createElement("tr");
  empty.className = "filter-empty";
  empty.innerHTML = '<td colspan="' + table.tHead.rows[0].cells.length + '">No analysis matches. Try a ticker such as AMD, or clear the filter.</td>';

  function apply() {
    var q = fold(input.value.trim());
    var shown = 0;
    rows.forEach(function (r) {
      var ok = (verdict === "all" || r.dataset.verdict === verdict) && (!q || r._text.indexOf(q) !== -1);
      r.hidden = !ok;
      if (ok) shown++;
    });
    if (shown === 0) tbody.appendChild(empty); else if (empty.parentNode) empty.remove();
    var filtered = q || verdict !== "all";
    status.textContent = filtered ? shown + " of " + rows.length + " analyses" : "";
  }

  input.addEventListener("input", apply);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { input.value = ""; apply(); }
  });

  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      verdict = c.dataset.v;
      chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
      apply();
    });
  });

  // "/" jumps to the search field
  document.addEventListener("keydown", function (e) {
    var t = e.target.tagName;
    if (e.key === "/" && t !== "INPUT" && t !== "TEXTAREA" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      input.focus();
    }
  });

  // Sortable columns
  var ths = Array.prototype.slice.call(table.tHead.rows[0].cells).filter(function (th) { return th.dataset.sort; });
  var keys = {
    ticker: function (r) { return r.dataset.ticker; },
    date: function (r) { return r.dataset.date; },
    upside: function (r) { return parseFloat(r.dataset.upside); }
  };
  ths.forEach(function (th) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sort";
    btn.innerHTML = th.innerHTML + '<span class="sort-mark" aria-hidden="true"></span>';
    th.innerHTML = "";
    th.appendChild(btn);
    btn.addEventListener("click", function () {
      var dir = th.getAttribute("aria-sort") === "descending" ? "ascending" : "descending";
      if (th.dataset.sort === "ticker" && !th.hasAttribute("aria-sort")) dir = "ascending";
      ths.forEach(function (x) { x.removeAttribute("aria-sort"); });
      th.setAttribute("aria-sort", dir);
      var k = keys[th.dataset.sort], m = dir === "ascending" ? 1 : -1;
      rows.sort(function (a, b) {
        var x = k(a), y = k(b);
        if (x < y) return -m;
        if (x > y) return m;
        return a.dataset.date < b.dataset.date ? 1 : -1;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
      if (empty.parentNode) tbody.appendChild(empty);
    });
  });

  // Optional deep link: /?q=amd or /?v=buy
  var params = new URLSearchParams(location.search);
  if (params.get("q")) input.value = params.get("q");
  var pv = params.get("v");
  chips.forEach(function (c) { if (c.dataset.v === pv && !c.disabled) c.click(); });

  bar.hidden = false;
  apply();
})();
