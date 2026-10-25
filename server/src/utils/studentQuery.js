
const validStatuses = ['Applied', 'Interview', 'Offered', 'Placed']

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

export function buildStudentQuery(query) {
  const filter = {}

  // Support q (test parameter) and search (API parameter)
  const searchValue = query.q ?? query.search

  if (
    searchValue !== undefined &&
    typeof searchValue !== 'string'
  ) {
    throw new Error('Search must be a string')
  }

  const search = (searchValue ?? '').trim().toLowerCase()

  if (search) {
    filter.search = search
  }

  // Validate placement status
  if (query.status !== undefined && typeof query.status !== 'string') {
    throw new Error('Status must be a string')
  }

  const status = (query.status ?? '').trim()

  if (status) {
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Allowed values: ${validStatuses.join(', ')}`
      )
    }

    filter.status = status
  }

  // Support pageSize (test parameter) and limit (API parameter)
  const limitValue = query.pageSize ?? query.limit

  function parsePositiveInteger(value, field, defaultValue, maxValue) {
    if (value === undefined) {
      return defaultValue
    }

    if (
      typeof value !== 'string' ||
      !/^[1-9]\d*$/.test(value) ||
      !Number.isSafeInteger(Number(value))
    ) {
      throw new Error(`${field} must be a positive integer`)
    }

    const number = Number(value)

    if (maxValue !== undefined && number > maxValue) {
      throw new Error(`${field} cannot exceed ${maxValue}`)
    }

    return number
  }

  const page = parsePositiveInteger(
    query.page,
    'page',
    DEFAULT_PAGE
  )

  const pageSize = parsePositiveInteger(
    limitValue,
    'pageSize',
    DEFAULT_LIMIT,
    MAX_LIMIT
  )

  return { filter, page, pageSize }
}
