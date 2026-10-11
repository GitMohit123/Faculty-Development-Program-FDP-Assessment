import { useState } from 'react'
import { validateStudent } from '../utils/studentValidation.js'

const statuses = ['Applied', 'Interview', 'Offered', 'Placed']

function StudentForm({ student, onClose, onSubmit }) {
  console.log(student);
  
  const [values, setValues] = useState({
    name: student?.name ?? '',
    email: student?.email ?? '',
    course: student?.course ?? '',
    status: student?.status ?? 'Applied',
  })
  const [error, setError] = useState('')
  const [loading,setLoading] = useState(false)
  
  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  async function handleSubmit(event) {
    setLoading(true)
    event.preventDefault()
    const validationMessage = validateStudent(values)
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      await onSubmit(values)
    } catch (submitError) {
      setError(submitError.message)
    }
    finally{
      setLoading(false)
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
            <input name="name" value={values.name} onChange={updateField} autoFocus />
          </label>
          <label className="form-field">
            Email address
            <input name="email" type="email" value={values.email} onChange={updateField} />
          </label>
          <label className="form-field">
            Course
            <input name="course" value={values.course} onChange={updateField} placeholder="e.g. B.Tech CSE" />
          </label>
          <label className="form-field">
            Placement status
            <select name="status" value={values.status} onChange={updateField}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit" disabled={loading}>{student ? 'Save changes' : 'Add student'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default StudentForm