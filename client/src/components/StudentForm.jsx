import { useState } from 'react';
// React hook form for form validation
import { useForm } from 'react-hook-form';
import { validateStudentFields } from '../utils/studentValidation.js';
import { toast } from 'react-toastify';

const statuses = ['Applied', 'Interview', 'Offered', 'Placed'];

function StudentForm({ student, onClose, onSubmit }) {
  // i've used 'react-hook-form';
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: student?.name ?? '',
      email: student?.email ?? '',
      course: student?.course ?? '',
      status: student?.status ?? 'Applied',
    },
  });

  const [submitError, setSubmitError] = useState('');

  function fieldRule(field) {
    return {
      validate: (value) =>
        validateStudentFields({ ...getValues(), [field]: value })[field] ??
        true,
    };
  }

  async function onFormSubmit(values) {
    setSubmitError('');
    try {
      await onSubmit(values);
      // toast to dipslay success message
      toast.success('Form submitted!');
    } catch (error) {
      setSubmitError(error.message);
      // toast to dipslay error message
      toast.error(error.message);
    }
  }

  function renderFieldError(field) {
    const message = errors[field]?.message;
    if (!message) return null;
    return (
      <span className="form-error" id={`${field}-error`}>
        {message}
      </span>
    );
  }

  function fieldA11y(field) {
    return {
      'aria-invalid': errors[field] ? 'true' : undefined,
      'aria-describedby': errors[field] ? `${field}-error` : undefined,
    };
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
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
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <form
          className="student-form"
          onSubmit={handleSubmit(onFormSubmit)}
          noValidate
        >
          <label className="form-field" htmlFor="name">
            Student name
            <input
              id="name"
              autoFocus
              {...register('name', fieldRule('name'))}
              {...fieldA11y('name')}
            />
            {renderFieldError('name')}
          </label>
          <label className="form-field" htmlFor="email">
            Email address
            <input
              id="email"
              type="email"
              {...register('email', fieldRule('email'))}
              {...fieldA11y('email')}
            />
            {renderFieldError('email')}
          </label>
          <label className="form-field" htmlFor="course">
            Course
            <input
              id="course"
              placeholder="e.g. B.Tech CSE"
              {...register('course', fieldRule('course'))}
              {...fieldA11y('course')}
            />
            {renderFieldError('course')}
          </label>
          <label className="form-field" htmlFor="status">
            Placement status
            <select
              id="status"
              {...register('status', fieldRule('status'))}
              {...fieldA11y('status')}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            {renderFieldError('status')}
          </label>
          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}
          <div className="form-actions">
            <button className="cancel-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {student ? 'Save changes' : 'Add student'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default StudentForm;
