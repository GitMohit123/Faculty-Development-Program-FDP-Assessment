const STATUSES = ["Applied", "Interview", "Offered", "Placed"];
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 100;

export class StudentQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = "StudentQueryError";
    this.status = 400;
  }
}


function readString(query, key) {
  const value = query[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new StudentQueryError(`${key} must be a single value`);
  }
  return value.trim();
}

function readPositiveInt(query, key, fallback, max) {
  const raw = readString(query, key);
  if (raw === undefined || raw === "") return fallback;

  if (!/^\d+$/.test(raw) || Number(raw) < 1) {
    throw new StudentQueryError(`${key} must be a positive whole number`);
  }

  const value = Number(raw);
  if (max && value > max) {
    throw new StudentQueryError(`${key} cannot be more than ${max}`);
  }
  return value;
}

export function buildStudentQuery(query = {}) {
  const filter = {};

  const status = readString(query, "status");
  if (status && status !== "All statuses") {
    if (!STATUSES.includes(status)) {
      throw new StudentQueryError(`status must be one of: ${STATUSES.join(", ")}`);
    }
    filter.status = status;
  }

  // both ?q= and ?search= are accepted
  const search = readString(query, "q") ?? readString(query, "search");
  if (search) {
    if (search.length > MAX_SEARCH_LENGTH) {
      throw new StudentQueryError(`search cannot be longer than ${MAX_SEARCH_LENGTH} characters`);
    }
    filter.search = search;
  }

  const page = readPositiveInt(query, "page", 1);
  
  const sizeKey = query.pageSize !== undefined ? "pageSize" : "limit";
  const pageSize = readPositiveInt(query, sizeKey, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  return { filter, page, pageSize };
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


export function toMongoFilter({ status, search }) {
  const mongoFilter = {};
  if (status) mongoFilter.status = status;

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    mongoFilter.$or = [{ name: pattern }, { email: pattern }];
  }

  return mongoFilter;
}
