import { useState } from 'react'
import { validateStudent } from '../utils/studentValidation.js'

const statuses = ['Applied', 'Interview', 'Offered', 'Placed']

function StudentForm({ student, onClose, onSubmit }) {
  const [values, setValues] = useState({
    name: student?.name ?? '',
    email: student?.email ?? '',
    course: student?.course ?? '',
    status: student?.status ?? 'Applied',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setErrors((current) => ({ ...current, [event.target.name]: '' }))
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    const validationErrors = {
      name: validateStudent(values, 'name'),
      email: validateStudent(values, 'email'),
      course: validateStudent(values, 'course'),
      status: validateStudent(values, 'status'),
    }

    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        course: values.course.trim(),
      })
    } catch (submitError) {
      setSubmitError(submitError.message || 'Unable to save the student. Please try again.')
    } finally {
      setSubmitting(false)
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
            <input name="name" value={values.name} onChange={updateField} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} required autoFocus />
            {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
          </label>
          <label className="form-field">
            Email address
            <input name="email" type="email" value={values.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} required />
            {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
          </label>
          <label className="form-field">
            Course
            <input name="course" value={values.course} onChange={updateField} aria-invalid={Boolean(errors.course)} aria-describedby={errors.course ? 'course-error' : undefined} placeholder="e.g. B.Tech CSE" required />
            {errors.course && <span className="field-error" id="course-error">{errors.course}</span>}
          </label>
          <label className="form-field">
            Placement status
            <select name="status" value={values.status} onChange={updateField} aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? 'status-error' : undefined} required>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            {errors.status && <span className="field-error" id="status-error">{errors.status}</span>}
          </label>
          {submitError && <p className="form-error" role="alert">{submitError}</p>}
          <div className="form-actions">
            <button className="cancel-button" type="button" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Saving...' : student ? 'Save changes' : 'Add student'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default StudentForm
