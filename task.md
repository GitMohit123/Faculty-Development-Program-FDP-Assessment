# MERN Stack Faculty Development Program Assessment

## Assessment Overview

- **Duration:** 90 minutes
- **Total Marks:** 100
- **Stack:** MongoDB, Express.js, React, Node.js
- **Project:** Campus Placement Records
- **Submission:** Push your work to your assigned Git branch and open a pull request to `main`.
- **Important:** Work only within the existing repository. Do not add Docker, deployment, authentication, or unrelated features.

## Objective

Complete the specified improvements to the existing Campus Placement Records application. The assessment evaluates your understanding of React state and forms, client-side validation, REST APIs, Express request handling, MongoDB/Mongoose validation, and reliable asynchronous UI behavior.

The starter application may contain incomplete functionality. Focus on the requirements below rather than rebuilding the application from scratch.

## Tasks

### Task 1 — Student Search and Status Filters (15 marks)

Implement the student-list filtering behavior.

Requirements:
- Search students by name or email, without case sensitivity.
- Filter students by placement status.
- Allow search and status filters to work together.
- Update the displayed results when either filter changes.
- Show a clear empty state when no records match.
- Ensure changing or clearing filters restores the appropriate results.

### Task 2 — Form Validation and Editing (20 marks)

Complete the student create/edit form behavior.

Requirements:
- Require the student's name, email, course, and placement status.
- Validate that the email address has a valid format.
- Display clear, field-specific validation messages.s
- Prevent submission when validation fails.
- Support editing an existing student and saving the changes to that record instead of creating a duplicate.
- Prevent repeated submissions while a save request is in progress.
- Display a useful success or error message after submission.

### Task 3 — API Filtering and Pagination (25 marks)

Implement query handling for `GET /api/students`.

Requirements:
- Support searching by student name or email.
- Support filtering by placement status.
- Support pagination through query parameters (for example, `page` and `limit`).
- Apply search and status filtering together.
- Validate query parameters and handle invalid values consistently.
- Return a predictable JSON response containing the records and pagination information.
- Keep the existing API response conventions and health endpoint working.

### Task 4 — Mongoose Validation and Data Integrity (20 marks)

Improve server-side validation and error handling.

Requirements:
- Enforce required student fields and valid placement-status values using the Mongoose model.
- Ensure email values are normalized consistently and duplicate emails are rejected.
- Run validators when updating a student.
- Handle malformed student IDs and valid-but-nonexistent IDs with appropriate client error responses.
- Return clear, consistent JSON errors without exposing stack traces or internal details.
- Do not rely only on frontend validation to protect data integrity.

### Task 5 — API Integration and Asynchronous UI Behavior (20 marks)

Make the frontend behave reliably when communicating with the API.

Requirements:
- Load and display student records from the API when API mode is used.
- Show loading, empty, success, and error states appropriately.
- Provide a way to retry after a failed request.
- Prevent outdated responses from overwriting newer results when search or filters change quickly.
- Avoid duplicate requests or submissions where appropriate.
- Keep sample/preview data clearly separate from real API data; do not silently show sample data as if an API request succeeded.

## General Requirements

- Preserve the existing project structure and working functionality.
- Use the existing libraries and coding conventions where practical.
- Keep changes focused on the assessment requirements.
- Use meaningful variable and function names.
- Handle expected errors gracefully.
- Do not hard-code secrets, credentials, or environment-specific URLs.
- Do not add Docker, deployment configuration, authentication, or unrelated features.
- Do not commit `node_modules`, local `.env` files, build output, or secrets.

## Local MongoDB and Starter Data

1. Install and run MongoDB Community Server locally. Follow the operating-system-specific instructions in `README.md`.
2. Use your own local assessment database; trainers do not share a database.
3. Configure the backend connection in `server/.env` with `MONGODB_URI`, using `server/.env.example` and `README.md` as references.
4. From the repository root, run `npm run seed` before starting the application.
5. The fictional seed records are starter data, not an assessed task. Use them to test searching, filtering, editing, and pagination.
6. Trainers do not need MongoDB accounts and must not share database credentials.
7. Database contents are not collected or separately evaluated. Marks are based on the submitted implementation and its behavior.

## Submission Instructions

1. Create and work on your assigned branch, using the naming convention provided by the assessor (for example, `submission/trainer-01`).
2. Run the available tests and build/lint checks before submitting.
3. Commit your changes to your assigned branch.
4. Push the branch to the shared GitHub repository.
5. Open a pull request targeting `main`.
6. In the pull request description, briefly list what you implemented and any known limitations.

Do not merge your pull request unless the assessor explicitly instructs you to do so.

## Evaluation

Your submission will be assessed on correctness, completeness, validation, API behavior, data integrity, asynchronous state handling, error handling, code clarity, and preservation of existing functionality. Partial credit may be awarded for correct, well-scoped implementations even if every requirement is not completed.
