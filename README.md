# Dance Class Management

Use the following prompt to generate a complete dance class management website:

```text
Build a full-stack “Dance Class Management” web application with a clean modern UI.

Core roles:
1) Admin login (secure username/password)
2) Student login (secure username/password)

Admin features:
- Student management (CRUD):
  - Add/Edit/Delete student with:
    - Full name
    - Mobile number
    - Payment mode
    - Membership plan (name + duration)
    - Membership start date
    - Membership end date
    - Fees paid amount
- Renewal logic:
  - If membership is near expiry and student renews before/at expiry, extend correctly from current end date based on selected plan.
  - If already expired and renewed, start from renewal date and calculate new end date.
- Status indicators in student list:
  - Green = active
  - Yellow = near expiry (configurable threshold, e.g., 7 days)
  - Red = expired
- Automatically move expired memberships to an “Expired Students” list.
- Filters in student section:
  - Filter by membership date range
  - Filter by membership plan
  - Search by name/mobile

Bulk upload:
- Add Excel upload (.xlsx/.csv) for students.
- Validate rows and import valid data.
- If a row has repeating student data identical to an existing record, ignore duplicate row and log/notify skipped duplicates.

Expenses:
- Admin can add expenses with:
  - Expense name
  - Amount
  - Date (day-month-year)
- Show monthly expense history for selected month.

Dashboard + Analytics:
- Admin dashboard should show overall summary:
  - Total active students
  - Expired students
  - Total collected fees
  - Total expenses
  - Net profit/loss
- Analytics section:
  - Profit/loss for current month
  - Profit/loss overall
  - Profit/loss for selected month(s)
  - Bar chart and pie chart for income vs expense and plan distribution
  - Smart suggestions based on profit/loss trends (e.g., reduce expenses, improve renewals, highlight top plans)

Student portal:
- Student can login and view only their own data:
  - Profile details
  - Membership plan, start/end dates, status
  - Payment history and payment mode
  - Renewal history

Technical requirements:
- Use role-based access control.
- Use form validation, server-side validation, and secure auth.
- Use relational DB schema for users, students, memberships, payments, expenses, uploads.
- Include audit-friendly timestamps and clear error/success messages.
- Make the UI responsive for mobile and desktop.
```
