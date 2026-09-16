const workflows = {
  manual: {
    label: "MANUAL WORKFLOW",
    time: "~75 min / report",
    steps: [
      ["01", "Export from Tally", "Download ledgers and vouchers for the selected period.", "12 min"],
      ["02", "Clean & reshape", "Rename columns, fix formats and remove duplicates.", "22 min"],
      ["03", "Copy formulas", "Update lookups, links, pivots and report ranges.", "28 min"],
      ["04", "Review & share", "Check totals, export the file and circulate it.", "13 min"]
    ],
    summary: ["!", "Every refresh restarts the work.", "The team spends time preparing numbers before it can analyse them."],
    freshness: "Updated manually"
  },
  automated: {
    label: "FINSYNCORA WORKFLOW",
    time: "~12 min / report",
    steps: [
      ["✓", "Tally data syncs", "A repeatable connector moves the required data into your reporting layer.", "Automatic"],
      ["✓", "Rules & checks run", "Mapped fields, validations and calculations apply consistently.", "Automatic"],
      ["✓", "Dashboard refreshes", "Sheets, Excel or BI views update from the prepared dataset.", "Automatic"],
      ["04", "Review & decide", "Your team checks exceptions and shares the latest view.", "12 min"]
    ],
    summary: ["✓", "The workflow does the repetitive work.", "Your team keeps control while management gets a consistent view sooner."],
    freshness: "Refresh-ready"
  }
};

const periodData = {
  sep: ["₹42.8L", "↑ 8.4% vs last month", "₹8.4L", "12 invoices due", "28.6%", "↑ 1.8 pts"],
  aug: ["₹39.5L", "↑ 2.1% vs last month", "₹9.1L", "15 invoices due", "26.8%", "↑ 0.6 pts"],
  jul: ["₹38.7L", "↑ 11.5% vs last month", "₹7.8L", "10 invoices due", "26.2%", "↓ 0.4 pts"]
};

const stepList = document.querySelector("#step-list");
const modeLabel = document.querySelector("#mode-label");
const timePill = document.querySelector("#time-pill");
const workflowSummary = document.querySelector("#workflow-summary");
const freshness = document.querySelector("#freshness");

function setMode(mode) {
  const config = workflows[mode];
  const automated = mode === "automated";
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  modeLabel.textContent = config.label;
  timePill.textContent = config.time;
  timePill.classList.toggle("auto", automated);
  stepList.innerHTML = config.steps.map(([number, title, detail, time]) => `
    <li class="step-item ${automated ? "is-auto" : ""}">
      <span class="step-number">${number}</span>
      <span class="step-copy"><strong>${title}</strong><small>${detail}</small></span>
      <span class="step-time">${time}</span>
    </li>`).join("");
  workflowSummary.classList.toggle("auto", automated);
  workflowSummary.innerHTML = `<span class="summary-icon">${config.summary[0]}</span><p><strong>${config.summary[1]}</strong><br>${config.summary[2]}</p>`;
  freshness.classList.toggle("fresh", automated);
  freshness.innerHTML = `<i></i> ${config.freshness}`;
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

document.querySelector("#period-select").addEventListener("change", (event) => {
  const values = periodData[event.target.value];
  ["sales-value", "sales-change", "receivable-value", "receivable-change", "margin-value", "margin-change"]
    .forEach((id, index) => { document.querySelector(`#${id}`).textContent = values[index]; });
  document.querySelector("#margin-change").classList.toggle("positive", !values[5].startsWith("↓"));
});

const reportRange = document.querySelector("#report-range");
function updateSavings() {
  const reports = Number(reportRange.value);
  const saved = Math.round((reports * (75 - 12)) / 60);
  document.querySelector("#report-count").textContent = reports;
  document.querySelector("#hours-saved").textContent = saved;
}
reportRange.addEventListener("input", updateSavings);


setMode("manual");
updateSavings();

