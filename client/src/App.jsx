import { useEffect, useState } from 'react'
import Pagination from './components/Pagination.jsx'
import StudentForm from './components/StudentForm.jsx'
import StudentTable from './components/StudentTable.jsx'
import { sampleStudents } from './data/sampleStudents.js'
import { useDebouncedValue } from './hooks/useDebouncedValue.js'
import { createStudent, fetchStudentPage, fetchStudentSummary, updateStudent } from './services/studentService.js'
import { filterStudents } from './utils/studentFilters.js'
import './App.css'

const PAGE_SIZE = 10
const SEARCH_DELAY_MS = 300

function App() {
  // key = the request these results belong to, so we can tell when they are out of date
  const [apiResult, setApiResult] = useState({ key: null, students: [], pagination: null, error: '' })
  const [apiSummary, setApiSummary] = useState(null)
  const [previewStudents, setPreviewStudents] = useState(sampleStudents)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [page, setPage] = useState(1)
  const [source, setSource] = useState('api')
  const [refreshKey, setRefreshKey] = useState(0)
  const [notice, setNotice] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)

  const isApi = source === 'api'
  const searchTerm = useDebouncedValue(query.trim(), SEARCH_DELAY_MS)
  const requestKey = JSON.stringify([searchTerm, statusFilter, page, refreshKey])

  useEffect(() => {
    if (source !== 'api') return

    // abort the previous request when filters change so a slow old response can't land on top of a newer one
    const controller = new AbortController()
    fetchStudentPage({ search: searchTerm, status: statusFilter, page, pageSize: PAGE_SIZE, signal: controller.signal })
      .then(({ students, pagination }) => {
        if (controller.signal.aborted) return
        setApiResult({ key: requestKey, students, pagination, error: '' })
        // e.g. after an edit moved the last record on this page out of the filter
        if (pagination?.pages > 0 && page > pagination.pages) setPage(pagination.pages)
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return
        setApiResult({ key: requestKey, students: [], pagination: null, error: requestError.message })
      })

    return () => controller.abort()
  }, [source, requestKey, searchTerm, statusFilter, page])

  useEffect(() => {
    if (source !== 'api') return

    const controller = new AbortController()
    fetchStudentSummary(controller.signal)
      .then((summary) => setApiSummary(summary))
      .catch(() => {
        if (!controller.signal.aborted) setApiSummary(null)
      })

    return () => controller.abort()
  }, [source, refreshKey])

  const loading = isApi && apiResult.key !== requestKey
  const error = isApi && !loading ? apiResult.error : ''
  const hasFilters = Boolean(query.trim() || statusFilter !== 'All statuses')
  const visibleStudents = isApi ? apiResult.students : filterStudents(previewStudents, query, statusFilter)
  const recordCount = isApi ? (apiResult.pagination?.total ?? 0) : visibleStudents.length

  const summary = isApi ? apiSummary : {
    total: previewStudents.length,
    placed: previewStudents.filter((student) => student.status === 'Placed').length,
    offered: previewStudents.filter((student) => student.status === 'Offered').length,
  }
  const totalCount = summary?.total ?? '–'
  const placedCount = summary?.placed ?? '–'
  const offeredCount = summary?.offered ?? '–'

  function changeQuery(value) {
    setQuery(value)
    setPage(1)
  }

  function changeStatusFilter(value) {
    setStatusFilter(value)
    setPage(1)
  }

  function clearFilters() {
    setQuery('')
    setStatusFilter('All statuses')
    setPage(1)
  }

  function openCreateForm() {
    setEditingStudent(null)
    setFormOpen(true)
    setNotice('')
  }

  function openEditForm(student) {
    setEditingStudent(student)
    setFormOpen(true)
    setNotice('')
  }

  function selectSource(nextSource) {
    if (nextSource === source) return
    setSource(nextSource)
    setNotice('')
  }

  function retryLoading() {
    setRefreshKey((key) => key + 1)
  }

  async function handleSave(values) {
    if (source === 'preview') {
      if (editingStudent) {
        setPreviewStudents((current) => current.map((item) => (
          item._id === editingStudent._id ? { ...item, ...values } : item
        )))
      } else {
        setPreviewStudents((current) => [{ ...values, _id: crypto.randomUUID() }, ...current])
      }
    } else if (editingStudent) {
      await updateStudent(editingStudent._id, values)
      setRefreshKey((key) => key + 1)
    } else {
      await createStudent(values)
      // newest records come first, so jump back to page 1 to show it
      setPage(1)
      setRefreshKey((key) => key + 1)
    }

    setFormOpen(false)
    setEditingStudent(null)
    const message = editingStudent ? `${values.name}'s record was updated.` : `${values.name} was added to the directory.`
    setNotice(source === 'preview' ? `${message} (Sample data only – nothing was saved to the database.)` : message)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Campus records home">
          <span className="brand-mark" aria-hidden="true">CR</span>
          <span>Campus records</span>
        </a>
        <div className="topbar-meta">
          <span className="term-label">PLACEMENT CELL <i /></span>
          <span className="term-name">2025–26</span>
        </div>
      </header>

      <section className="page-content" id="main">
        <div className="page-heading">
          <div>
            <p className="eyebrow">STUDENT OUTCOMES / OVERVIEW</p>
            <h1>Campus placement records</h1>
            <p className="heading-copy">A clear view of every student's next step.</p>
          </div>
          <button className="primary-button" type="button" onClick={openCreateForm}>
            <span aria-hidden="true">+</span> Add student
          </button>
        </div>

        <section className="summary-grid" aria-label="Placement summary">
          <article className="summary-item summary-total">
            <span className="summary-label">TOTAL STUDENTS</span>
            <strong>{totalCount}</strong>
            <span className="summary-foot">In the current view</span>
          </article>
          <article className="summary-item">
            <span className="summary-label">PLACED</span>
            <strong>{placedCount}</strong>
            <span className="summary-foot">Offer accepted</span>
          </article>
          <article className="summary-item">
            <span className="summary-label">OFFERS</span>
            <strong>{offeredCount}</strong>
            <span className="summary-foot">Awaiting decision</span>
          </article>
          <article className="summary-aside">
            <span className="aside-symbol" aria-hidden="true">↗</span>
            <span>Spring placement<br />cycle</span>
            <small>RECORDS UPDATED AS THEY PROGRESS</small>
          </article>
        </section>

        <section className="records-section" aria-labelledby="records-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DIRECTORY</p>
              <h2 id="records-title">Student records <span>{totalCount}</span></h2>
            </div>
            <div className="source-switch" aria-label="Records source">
              <button
                type="button"
                className={source === 'api' ? 'selected' : ''}
                aria-pressed={source === 'api'}
                onClick={() => selectSource('api')}
              >API data</button>
              <button
                type="button"
                className={source === 'preview' ? 'selected' : ''}
                aria-pressed={source === 'preview'}
                onClick={() => selectSource('preview')}
              >Sample preview</button>
            </div>
          </div>

          {!isApi && (
            <p className="preview-banner">
              You are looking at sample data. Changes made here stay in this browser tab and are not saved to the database.
            </p>
          )}
          {notice && <p className="notice-message" role="status">{notice}</p>}

          <div className="table-toolbar">
            <label className="search-field">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <span className="sr-only">Search students by name or email</span>
              <input
                type="search"
                value={query}
                placeholder="Search name or email"
                onChange={(event) => changeQuery(event.target.value)}
              />
              {query && <button type="button" aria-label="Clear search" onClick={() => changeQuery('')}>×</button>}
            </label>
            <label className="filter-field">
              <span className="sr-only">Filter by placement status</span>
              <select value={statusFilter} onChange={(event) => changeStatusFilter(event.target.value)}>
                <option>All statuses</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offered</option>
                <option>Placed</option>
              </select>
            </label>
            {(query || statusFilter !== 'All statuses') && (
              <button
                className="text-button clear-filters"
                type="button"
                onClick={clearFilters}
              >Clear filters</button>
            )}
            <span className="record-count">{loading ? '…' : recordCount} RECORDS</span>
          </div>

          {error && (
            <div className="state-panel error-panel" role="alert">
              <strong>Records could not be loaded</strong>
              <p>{error}</p>
              <button className="secondary-button" type="button" onClick={retryLoading}>Try again</button>
            </div>
          )}
          {!error && loading && <div className="state-panel" role="status">Loading student records…</div>}
          {!error && !loading && (
            <>
              <StudentTable
                students={visibleStudents}
                hasFilters={hasFilters}
                onEdit={openEditForm}
              />
              {isApi && <Pagination page={page} pages={apiResult.pagination?.pages} onChange={setPage} />}
            </>
          )}
          <div className="table-footer">
            <span>PLACEMENT OFFICE <i /></span>
            <span>{source === 'preview' ? 'SAMPLE DATA' : 'LIVE RECORDS'}</span>
          </div>
        </section>
      </section>

      <footer className="page-footer">
        <span>Campus placement office</span>
        <span>INTERNAL RECORDS · {new Date().getFullYear()}</span>
      </footer>

      {formOpen && (
        <StudentForm
          student={editingStudent}
          existingStudents={isApi ? apiResult.students : previewStudents}
          onClose={() => { setFormOpen(false); setEditingStudent(null) }}
          onSubmit={handleSave}
        />
      )}
    </main>
  )
}

export default App
