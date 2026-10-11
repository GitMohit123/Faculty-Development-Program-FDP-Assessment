const ALLOWED_STATUSES = ["Applied", "Interview", "Offered", "Placed"];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class QueryValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "QueryValidationError";
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parsePositiveInt(value, fallback, field, max = Infinity) {
  if (value === undefined || value === "") return fallback;
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw new QueryValidationError(`${field} must be a positive whole number`);
  }
  const number = Number(value);
  if (number < 1 || number > max) {
    throw new QueryValidationError(
      max === Infinity ? `${field} must be at least 1` : `${field} must be between 1 and ${max}`
    );
  }
  return number;
}

export function buildStudentQuery(query = {}) {
  const { search, status, page, limit, pageSize } = query;
  const filter = {};

  if (search !== undefined) {
    if (typeof search !== "string") {
      throw new QueryValidationError("search must be a single text value");
    }
    const term = search.trim();
    if (term) {
      const pattern = new RegExp(escapeRegex(term), "i");
      filter.$or = [{ name: pattern }, { email: pattern }];
    }
  }

  if (status !== undefined && status !== "" && status !== "All") {
    if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status)) {
      throw new QueryValidationError(`status must be one of: ${ALLOWED_STATUSES.join(", ")}`);
    }
    filter.status = status;
  }

  
  const rawLimit = limit !== undefined ? limit : pageSize;

  return {
    filter,
    page: parsePositiveInt(page, DEFAULT_PAGE, "page"),
    pageSize: parsePositiveInt(rawLimit, DEFAULT_LIMIT, "limit", MAX_LIMIT),
  };
}