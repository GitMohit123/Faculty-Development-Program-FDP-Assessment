
const ALLOWED_STATUSES = [
  "Applied",
  "Interview",
  "Offered",
  "Placed",
];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export function buildStudentQuery(query = {}) {
  const {
    search = "",
    status = "",
    page = "1",
    limit,
    pageSize,
  } = query;

  if (typeof search !== "string" || typeof status !== "string") {
    throw new Error("Invalid search or status parameter");
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    throw new Error("Invalid placement status");
  }

  if (limit !== undefined && pageSize !== undefined) {
    throw new Error("Use either limit or pageSize, not both");
  }

  function parsePositiveInteger(value, name, max = Number.MAX_SAFE_INTEGER) {
    if (
      typeof value !== "string" ||
      !/^[1-9]\d*$/.test(value)
    ) {
      throw new Error(`Invalid ${name} parameter`);
    }

    const parsed = Number(value);

    if (!Number.isSafeInteger(parsed) || parsed > max) {
      throw new Error(`Invalid ${name} parameter`);
    }

    return parsed;
  }

  const parsedPage = parsePositiveInteger(page, "page");

  const rawPageSize =
    limit ?? pageSize ?? String(DEFAULT_PAGE_SIZE);

  const parsedPageSize = parsePositiveInteger(
    rawPageSize,
    limit !== undefined ? "limit" : "pageSize",
    MAX_PAGE_SIZE
  );

  const filter = {};
  const searchTerm = search.trim();

  if (searchTerm) {
    const escapedSearch = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (status) {
    filter.status = status;
  }

  return {
    filter,
    page: parsedPage,
    pageSize: parsedPageSize,
  };
}
