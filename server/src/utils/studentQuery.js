export function buildStudentQuery(query) {
  // Challenge 3: validate query parameters and build search/status filters and pagination.
  const search = query.q ?? query.search ?? "";
  const status = query.status ?? "";
  const pageValue = query.page ?? "1";
  const pageSizeValue = query.limit ?? query.pageSize ?? "10";

  if (typeof search !== "string" || typeof status !== "string") {
    throw new URIError("Search and status must be single values");
  }


  if (status && !["Applied", "Interview", "Offered", "Placed"].includes(status)) {
    throw new URIError("Invalid placement status");
  }

  if (typeof pageValue !== "string" || typeof pageSizeValue !== "string" || !/^\d+$/.test(pageValue) || !/^\d+$/.test(pageSizeValue)) {
    throw new URIError("Page and limit must be positive integers");
  }

  const page = Number(pageValue);
  const pageSize = Number(pageSizeValue);

  if (page < 1 || pageSize < 1 || pageSize > 100) {
    throw new URIError("Page must be positive and limit must be between 1 and 100");
  }

  const filter={};
  if (status) filter.status =status;
  if(search.trim()) filter.search =search.trim();
  return { filter, page, pageSize };
}
