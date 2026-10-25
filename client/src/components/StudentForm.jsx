
import { useState } from 'react'
import { validateStudent } from '../utils/studentValidation.js'

const statuses = ['Applied', 'Interview', 'Offered', 'Placed']

function StudentForm({ student, onClose, onSubmit }) {
  const [values, setValues] = useState({
    name: student?.name ?? '',
    email: student?.email ?? '',
    course: student?.course ?? '',
    status: student?.status ?? '',
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))

    setFieldErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })

    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) return

    const validationErrors = validateStudent(values)
    setFieldErrors(validationErrors)
    setError('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        course: values.course.trim(),
        status: values.status,
      })
    } catch (submitError) {
      setError(submitError.message || 'Unable to save the student.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose()
        }
      }}
    >
      <section
        className="student-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-form-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">STUDENT DIRECTORY</p>
            <h2 id="student-form-title">
              {student ? 'Edit student' : 'Add student'}
            </h2>
          </div>

          <button
            className="modal-close"
            type="button"
            aria-label="Close form"
            disabled={isSubmitting}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="student-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="form-field">
            Student name
            <input
              name="name"
              value={values.name}
              onChange={updateField}
              autoFocus
              required
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name ? 'name-error' : undefined
              }
            />
            {fieldErrors.name && (
              <span className="form-error" id="name-error" role="alert">
                {fieldErrors.name}
              </span>
            )}
          </label>

          <label className="form-field">
            Email address
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={updateField}
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={
                fieldErrors.email ? 'email-error' : undefined
              }
            />
            {fieldErrors.email && (
              <span className="form-error" id="email-error" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label className="form-field">
            Course
            <input
              name="course"
              value={values.course}
              onChange={updateField}
              placeholder="e.g. B.Tech CSE"
              required
              aria-invalid={Boolean(fieldErrors.course)}
              aria-describedby={
                fieldErrors.course ? 'course-error' : undefined
              }
            />
            {fieldErrors.course && (
              <span className="form-error" id="course-error" role="alert">
                {fieldErrors.course}
              </span>
            )}
          </label>

          <label className="form-field">
            Placement status
            <select
              name="status"
              value={values.status}
              onChange={updateField}
              required
              aria-invalid={Boolean(fieldErrors.status)}
              aria-describedby={
                fieldErrors.status ? 'status-error' : undefined
              }
            >
              <option value="">Select placement status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {fieldErrors.status && (
              <span className="form-error" id="status-error" role="alert">
                {fieldErrors.status}
              </span>
            )}
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button
              className="cancel-button"
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : student
                  ? 'Save changes'
                  : 'Add student'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default StudentForm
