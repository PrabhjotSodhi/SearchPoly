(function () {
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const llm = (params.get("llm") || "on") !== "off";

  // Set form values for continuity
  const qInput = document.getElementById("q");
  const llmInput = document.getElementById("llm");
  if (qInput) qInput.value = q;
  if (llmInput) llmInput.checked = llm;

  // Build API URL from current params
  const apiUrl = `/api/search?${params.toString()}`;

  // Small helpers
  const chips = document.getElementById("chips");
  const results = document.getElementById("results");
  const links = document.getElementById("links");
  const debug = document.getElementById("debug");

  fetch(apiUrl)
    .then(r => r.json())
    .then(data => {
      // Pills
      chips.innerHTML = "";
      const p = data.parsed || {};
      const locationParams = data.locationParams || {};
      const pills = [];
      if (p.property_type?.length) pills.push(`Type: ${p.property_type.join(", ")}`);
      if (p.price_min != null) pills.push(`Min: $${Number(p.price_min).toLocaleString()}`);
      if (p.price_max != null) pills.push(`Max: $${Number(p.price_max).toLocaleString()}`);
      if (p.bedrooms_min != null) pills.push(`Beds ≥ ${p.bedrooms_min}`);
      if (p.bedrooms_max != null) pills.push(`Beds ≤ ${p.bedrooms_max}`);
      if (p.open_homes) pills.push("Open homes");
      if (locationParams.suburb) pills.push(`SuburbID: ${locationParams.suburb}`);
      chips.innerHTML = pills.map(x => `<span class="pill">${escapeHtml(x)}</span>`).join("");

      // Links
      const shareUrl = location.pathname + "?" + params.toString();
      links.innerHTML =
        `Shareable URL: <a href="${shareUrl}">${shareUrl}</a><br>` +
        `Trade Me request: <a href="${data.tmUrl}" target="_blank" rel="noreferrer">${data.tmUrl}</a>`;

      // Results
      results.innerHTML = "";
      const list = data.results || [];
      if (!list.length) {
        results.innerHTML = `<p class="muted">No results for this combination. Try loosening filters.</p>`;
      } else {
        results.innerHTML = list
          .map(
            r => `
          <article class="card">
            <img src="${r.image || ""}" alt="">
            <div class="content">
              <div><strong>${escapeHtml(r.title || "")}</strong></div>
              <div>${escapeHtml(r.price || "")}</div>
              <div>${escapeHtml(r.suburb || "")}${r.region ? ", " + escapeHtml(r.region) : ""}</div>
            </div>
          </article>`
          )
          .join("");
      }

      // Debug
      if (debug) {
        debug.textContent = JSON.stringify({ parsed: p, locationParams, tmUrl: data.tmUrl }, null, 2);
      }
    })
    .catch(e => {
      results.innerHTML = `<p class="muted">Error loading results: ${escapeHtml(e.message)}</p>`;
    });

  function escapeHtml(s = "") {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
})();
