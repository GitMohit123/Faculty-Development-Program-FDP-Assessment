import { useRef, useState } from 'react'
import { getStudentFieldErrors } from '../utils/studentValidation.js'

const statuses = ['Applied', 'Interview', 'Offered', 'Placed']

function StudentForm({ student, onClose, onSubmit }) {
  const [values, setValues] = useState({
    name: student?.name ?? '',
    email: student?.email ?? '',
    course: student?.course ?? '',
    status: student?.status ?? 'Applied',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submissionInProgress = useRef(false)

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submissionInProgress.current) return

    const errors = getStudentFieldErrors(values)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0])
      return
    }

    submissionInProgress.current = true
    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        course: values.course.trim(),
        status: values.status,
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      submissionInProgress.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="student-form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">STUDENT DIRECTORY</p>
            <h2 id="student-form-title">{student ? 'Edit student' : 'Add student'}</h2>
          </div>
          <button className="modal-close" type="button" aria-label="Close form" onClick={onClose}>×</button>
        </div>
        <form className="student-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            Student name
            <input
              name="name"
              value={values.name}
              onChange={updateField}
              autoFocus
              aria-invalid={Boolean(fieldErrors.name)}
            />
            {fieldErrors.name && <span className="form-error" role="alert">{fieldErrors.name}</span>}
          </label>

          <label className="form-field">
            Email address
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={updateField}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <span className="form-error" role="alert">{fieldErrors.email}</span>}
          </label>

          <label className="form-field">
            Course
            <input
              name="course"
              value={values.course}
              onChange={updateField}
              placeholder="e.g. B.Tech CSE"
              aria-invalid={Boolean(fieldErrors.course)}
            />
            {fieldErrors.course && <span className="form-error" role="alert">{fieldErrors.course}</span>}
          </label>

          <label className="form-field">
            Placement status
            <select name="status" value={values.status} onChange={updateField} aria-invalid={Boolean(fieldErrors.status)}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            {fieldErrors.status && <span className="form-error" role="alert">{fieldErrors.status}</span>}
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (student ? 'Saving...' : 'Adding...') : (student ? 'Save changes' : 'Add student')}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default StudentForm