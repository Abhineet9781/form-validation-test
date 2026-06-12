# Automated Form Validation Testing Tool

A Selenium WebDriver + JavaScript automation suite that tests a registration
form's client-side validation logic across 20 scenarios — covering valid
inputs, invalid inputs, boundary values, and mandatory field checks.

## Project Structure
```
form-validation-test/
├── form.html              # The form under test (Name, Email, Password, Confirm Password)
├── package.json
├── test-cases.md          # Manual test case design (written before automation)
├── tests/
│   └── formValidation.test.js   # Selenium automation script (20 test cases)
└── results/
    ├── results.json       # Machine-readable test results
    └── results.md         # Human-readable results report
```

## Prerequisites
- Node.js (v16+)
- Google Chrome installed
- ChromeDriver matching your Chrome version (managed automatically by
  `selenium-webdriver` 4.6+ via Selenium Manager, no manual setup needed
  in most cases)

## Setup
```bash
npm install
```

## Run Tests
```bash
npm test
```

This will:
1. Launch headless Chrome
2. Run all 20 test cases against `form.html`
3. Print PASS/FAIL results to the console
4. Write `results/results.json` and `results/results.md`

## Test Coverage (20 scenarios)
| Field | Scenarios Covered |
|-------|--------------------|
| Name | Empty, special characters, max length boundary, valid, leading/trailing spaces |
| Email | Empty, missing @, missing domain, spaces, valid |
| Password | Empty, too short, missing uppercase, missing number, valid boundary (8 chars) |
| Confirm Password | Empty, mismatch, match |
| Form | Full valid submission, multiple errors at once |

See `test-cases.md` for the complete manual test case design that was
created before writing automation code.

## Notes
- Validation logic is implemented in plain JavaScript inside `form.html`
  (no backend required), making the suite fully self-contained and runnable
  offline.
- Failed test cases are automatically logged with input data, expected vs.
  actual results, and step-by-step reproduction steps in `results/results.md`.
