export function exportAsJSON(transactions) {
  const dataStr = JSON.stringify(transactions, null, 2);
  downloadFile(dataStr, "transactions.json", "application/json");
}

export function exportAsCSV(transactions) {
  if (transactions.length === 0) return;

  const headers = Object.keys(transactions[0]);
  const rows = transactions.map((t) =>
    headers.map((key) => `"${String(t[key]).replace(/"/g, '""')}"`).join(","),
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  downloadFile(csvContent, "transactions.csv", "text/csv");
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
