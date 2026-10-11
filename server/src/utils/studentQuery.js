const validStatuses = ["Applied", "Interview", "Offered", "Placed"];

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function buildStudentQuery(query = {}) {
  const rawSearch = typeof query.q === "string" ? query.q : typeof query.search === "string" ? query.search : "";
  const search = rawSearch.trim();
  const status = typeof query.status === "string" ? query.status.trim() : "";

  const filter = {};

  if (validStatuses.includes(status)) {
    filter.status = status;
  }

  if (search) {
    filter.search = search.toLowerCase();
  }

  return {
    filter,
    page: parsePositiveInteger(query.page, 1),
    pageSize: Math.min(parsePositiveInteger(query.pageSize, 10), 100),
  };
}