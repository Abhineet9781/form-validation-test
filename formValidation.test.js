/**
 * Automated Form Validation Testing Tool
 * Author: Abhineet Kumar
 *
 * This script uses Selenium WebDriver to automate 20 test scenarios
 * against the registration form (form.html), covering valid and
 * invalid inputs, boundary values, and mandatory field checks.
 *
 * Results (PASS/FAIL + reproduction steps for failures) are logged
 * to the console and written to results/results.json and results/results.md
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');

const FORM_PATH = 'file://' + path.resolve(__dirname, '..', 'form.html');
const results = [];

// Helper: fill the form fields (pass null to skip / leave empty)
async function fillForm(driver, { name, email, password, confirmPassword }) {
  const nameInput = await driver.findElement(By.id('name'));
  const emailInput = await driver.findElement(By.id('email'));
  const passwordInput = await driver.findElement(By.id('password'));
  const confirmInput = await driver.findElement(By.id('confirmPassword'));

  await nameInput.clear();
  await emailInput.clear();
  await passwordInput.clear();
  await confirmInput.clear();

  if (name !== null && name !== undefined) await nameInput.sendKeys(name);
  if (email !== null && email !== undefined) await emailInput.sendKeys(email);
  if (password !== null && password !== undefined) await passwordInput.sendKeys(password);
  if (confirmPassword !== null && confirmPassword !== undefined) await confirmInput.sendKeys(confirmPassword);
}

async function getErrorText(driver, fieldId) {
  const el = await driver.findElement(By.id(`${fieldId}-error`));
  return (await el.getText()).trim();
}

async function getSuccessText(driver) {
  const el = await driver.findElement(By.id('success'));
  return (await el.getText()).trim();
}

async function submitForm(driver) {
  await driver.findElement(By.id('submit')).click();
}

// Logs a result entry
function logResult(id, description, input, expected, actual, passed) {
  const status = passed ? 'PASS' : 'FAIL';
  const entry = { id, description, input, expected, actual, status };
  results.push(entry);

  console.log(`[${status}] ${id} - ${description}`);
  if (!passed) {
    console.log(`   Input: ${JSON.stringify(input)}`);
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
    console.log('   Steps to reproduce:');
    console.log(`     1. Open form.html`);
    console.log(`     2. Enter input as shown above into the relevant field(s)`);
    console.log(`     3. Click the "Register" submit button`);
    console.log(`     4. Observe the error/result message does not match expected`);
  }
}

(async function runTests() {
  const options = new chrome.Options();
  options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // ---------- TC01: Empty name ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: '', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    let actual = await getErrorText(driver, 'name');
    logResult('TC01', 'Empty name on submit', { name: '' }, 'Name is required', actual, actual === 'Name is required');

    // ---------- TC02: Name with numbers/special chars ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John123!', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'name');
    logResult('TC02', 'Name with numbers/special chars', { name: 'John123!' }, 'Name must contain only letters and spaces', actual, actual === 'Name must contain only letters and spaces');

    // ---------- TC03: Name exceeding max length (51 chars) ----------
    await driver.get(FORM_PATH);
    const longName = 'A'.repeat(51);
    await fillForm(driver, { name: longName, email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'name');
    // Note: input has maxlength=50, so browser truncates input to 50 chars before submit
    logResult('TC03', 'Name exceeding max length (51 chars, browser truncates to 50)', { name: longName }, 'No error shown (truncated to 50 chars, valid)', actual, actual === '');

    // ---------- TC04: Valid name ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'name');
    logResult('TC04', 'Valid name', { name: 'John Doe' }, 'No error shown', actual, actual === '');

    // ---------- TC05: Empty email ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: '', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'email');
    logResult('TC05', 'Empty email on submit', { email: '' }, 'Email is required', actual, actual === 'Email is required');

    // ---------- TC06: Invalid email - no @ ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'johndoe.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'email');
    logResult('TC06', 'Invalid email format - missing @', { email: 'johndoe.com' }, 'Please enter a valid email address', actual, actual === 'Please enter a valid email address');

    // ---------- TC07: Invalid email - no domain ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john@doe', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'email');
    logResult('TC07', 'Invalid email format - missing domain extension', { email: 'john@doe' }, 'Please enter a valid email address', actual, actual === 'Please enter a valid email address');

    // ---------- TC08: Invalid email - spaces ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'email');
    logResult('TC08', 'Invalid email format - contains spaces', { email: 'john doe@test.com' }, 'Please enter a valid email address', actual, actual === 'Please enter a valid email address');

    // ---------- TC09: Valid email ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'email');
    logResult('TC09', 'Valid email', { email: 'john.doe@test.com' }, 'No error shown', actual, actual === '');

    // ---------- TC10: Empty password ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: '', confirmPassword: '' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'password');
    logResult('TC10', 'Empty password on submit', { password: '' }, 'Password is required', actual, actual === 'Password is required');

    // ---------- TC11: Password less than 8 chars ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abc123', confirmPassword: 'Abc123' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'password');
    logResult('TC11', 'Password less than 8 characters', { password: 'Abc123' }, 'Password must be at least 8 characters', actual, actual === 'Password must be at least 8 characters');

    // ---------- TC12: Password without uppercase ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'abcdefgh1', confirmPassword: 'abcdefgh1' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'password');
    logResult('TC12', 'Password without uppercase letter', { password: 'abcdefgh1' }, 'Password must contain at least one uppercase letter and one number', actual, actual === 'Password must contain at least one uppercase letter and one number');

    // ---------- TC13: Password without number ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdefgh', confirmPassword: 'Abcdefgh' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'password');
    logResult('TC13', 'Password without a number', { password: 'Abcdefgh' }, 'Password must contain at least one uppercase letter and one number', actual, actual === 'Password must contain at least one uppercase letter and one number');

    // ---------- TC14: Valid password - boundary exactly 8 chars ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'password');
    logResult('TC14', 'Valid password - boundary value exactly 8 characters', { password: 'Abcdef12' }, 'No error shown', actual, actual === '');

    // ---------- TC15: Empty confirm password ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: '' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'confirmPassword');
    logResult('TC15', 'Empty confirm password on submit', { confirmPassword: '' }, 'Please confirm your password', actual, actual === 'Please confirm your password');

    // ---------- TC16: Confirm password mismatch ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef13' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'confirmPassword');
    logResult('TC16', 'Confirm password does not match password', { password: 'Abcdef12', confirmPassword: 'Abcdef13' }, 'Passwords do not match', actual, actual === 'Passwords do not match');

    // ---------- TC17: Confirm password matches ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'confirmPassword');
    logResult('TC17', 'Confirm password matches password', { password: 'Abcdef12', confirmPassword: 'Abcdef12' }, 'No error shown', actual, actual === '');

    // ---------- TC18: All valid - successful submission ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getSuccessText(driver);
    logResult('TC18', 'All fields valid - successful submission', { name: 'John Doe', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' }, 'Registration successful!', actual, actual === 'Registration successful!');

    // ---------- TC19: Name with leading/trailing spaces ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: '  John Doe  ', email: 'john.doe@test.com', password: 'Abcdef12', confirmPassword: 'Abcdef12' });
    await submitForm(driver);
    actual = await getErrorText(driver, 'name');
    logResult('TC19', 'Name with leading/trailing spaces (trimmed)', { name: '  John Doe  ' }, 'No error shown', actual, actual === '');

    // ---------- TC20: All fields empty - multiple errors ----------
    await driver.get(FORM_PATH);
    await fillForm(driver, { name: '', email: '', password: '', confirmPassword: '' });
    await submitForm(driver);
    const nameErr = await getErrorText(driver, 'name');
    const emailErr = await getErrorText(driver, 'email');
    const passErr = await getErrorText(driver, 'password');
    const confirmErr = await getErrorText(driver, 'confirmPassword');
    const allShown = nameErr !== '' && emailErr !== '' && passErr !== '' && confirmErr !== '';
    logResult(
      'TC20',
      'Multiple invalid fields submitted together (all empty)',
      { name: '', email: '', password: '', confirmPassword: '' },
      'All four error messages displayed simultaneously',
      JSON.stringify({ nameErr, emailErr, passErr, confirmErr }),
      allShown
    );

  } finally {
    await driver.quit();

    // Write results to files
    const resultsDir = path.resolve(__dirname, '..', 'results');
    if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

    fs.writeFileSync(path.join(resultsDir, 'results.json'), JSON.stringify(results, null, 2));

    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;

    let md = `# Test Results\n\n`;
    md += `**Total:** ${results.length} | **Passed:** ${passCount} | **Failed:** ${failCount}\n\n`;
    md += `| ID | Description | Status |\n|----|--------------|--------|\n`;
    results.forEach(r => {
      md += `| ${r.id} | ${r.description} | ${r.status} |\n`;
    });

    if (failCount > 0) {
      md += `\n## Failure Details\n\n`;
      results.filter(r => r.status === 'FAIL').forEach(r => {
        md += `### ${r.id} - ${r.description}\n`;
        md += `- **Input:** \`${JSON.stringify(r.input)}\`\n`;
        md += `- **Expected:** ${r.expected}\n`;
        md += `- **Actual:** ${r.actual}\n`;
        md += `- **Steps to reproduce:**\n`;
        md += `  1. Open form.html\n`;
        md += `  2. Enter the input above into the relevant field(s)\n`;
        md += `  3. Click the "Register" button\n`;
        md += `  4. Observe the actual result does not match expected\n\n`;
      });
    }

    fs.writeFileSync(path.join(resultsDir, 'results.md'), md);

    console.log(`\n=== SUMMARY: ${passCount}/${results.length} PASSED, ${failCount} FAILED ===`);
    console.log('Results written to results/results.json and results/results.md');
  }
})();
