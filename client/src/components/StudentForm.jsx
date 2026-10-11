import { useState } from 'react'
import { getStudentErrors } from '../utils/studentValidation.js'

const statuses = ['Applied', 'Interview', 'Offered', 'Placed']

function StudentForm({ student, existingStudents = [], onClose, onSubmit }) {
  const [values, setValues] = useState({
    name: student?.name ?? '',
    email: student?.email ?? '',
    course: student?.course ?? '',
    status: student?.status ?? 'Applied',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return

    // when editing, the record's own email shouldn't count as a duplicate
    const otherStudents = existingStudents.filter((other) => !student || other._id !== student._id)
    const errors = getStudentErrors(values, otherStudents)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSaving(true)
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        course: values.course.trim(),
      })
    } catch (submitError) {
      if (submitError.fieldErrors) {
        setFieldErrors(submitError.fieldErrors)
      } else if (submitError.status === 409) {
        setFieldErrors({ email: submitError.message })
      }
      setError(submitError.message || 'Could not save the student. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => !saving && event.target === event.currentTarget && onClose()}>
      <section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="student-form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">STUDENT DIRECTORY</p>
            <h2 id="student-form-title">{student ? 'Edit student' : 'Add student'}</h2>
          </div>
          <button className="modal-close" type="button" aria-label="Close form" onClick={onClose} disabled={saving}>×</button>
        </div>
        <form className="student-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            Student name
            <input name="name" value={values.name} onChange={updateField} aria-invalid={Boolean(fieldErrors.name)} autoFocus />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </label>
          <label className="form-field">
            Email address
            <input name="email" type="email" value={values.email} onChange={updateField} aria-invalid={Boolean(fieldErrors.email)} />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </label>
          <label className="form-field">
            Course
            <input name="course" value={values.course} onChange={updateField} placeholder="e.g. B.Tech CSE" aria-invalid={Boolean(fieldErrors.course)} />
            {fieldErrors.course && <span className="field-error">{fieldErrors.course}</span>}
          </label>
          <label className="form-field">
            Placement status
            <select name="status" value={values.status} onChange={updateField} aria-invalid={Boolean(fieldErrors.status)}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            {fieldErrors.status && <span className="field-error">{fieldErrors.status}</span>}
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button className="cancel-button" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Saving…' : student ? 'Save changes' : 'Add student'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default StudentForm