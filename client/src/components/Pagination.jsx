function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null

  return (
    <nav className="pagination" aria-label="Student record pages">
      <button className="text-button" type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Previous
      </button>
      <span>Page {page} of {pages}</span>
      <button className="text-button" type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </nav>
  )
}

export default Pagination
