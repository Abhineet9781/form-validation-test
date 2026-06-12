# Test Cases – Automated Form Validation Testing Tool

| ID  | Field             | Scenario                                   | Input                              | Expected Result                                              |
|-----|-------------------|---------------------------------------------|-------------------------------------|---------------------------------------------------------------|
| TC01| Name              | Empty name on submit                         | ""                                   | Error: "Name is required"                                      |
| TC02| Name              | Name with numbers/special chars              | "John123!"                          | Error: "Name must contain only letters and spaces"             |
| TC03| Name              | Name exceeding max length (51 chars)         | "A" x 51                            | Error: "Name must be 50 characters or less"                    |
| TC04| Name              | Valid name                                   | "John Doe"                          | No error shown                                                 |
| TC05| Email             | Empty email on submit                        | ""                                   | Error: "Email is required"                                     |
| TC06| Email             | Invalid format – no @                        | "johndoe.com"                       | Error: "Please enter a valid email address"                    |
| TC07| Email             | Invalid format – no domain                   | "john@doe"                          | Error: "Please enter a valid email address"                    |
| TC08| Email             | Invalid format – spaces in email             | "john doe@test.com"                 | Error: "Please enter a valid email address"                    |
| TC09| Email             | Valid email                                  | "john.doe@test.com"                 | No error shown                                                 |
| TC10| Password          | Empty password on submit                     | ""                                   | Error: "Password is required"                                  |
| TC11| Password          | Password less than 8 characters              | "Abc123"                             | Error: "Password must be at least 8 characters"                |
| TC12| Password          | Password without uppercase letter            | "abcdefgh1"                          | Error: "Password must contain at least one uppercase letter and one number" |
| TC13| Password          | Password without number                      | "Abcdefgh"                           | Error: "Password must contain at least one uppercase letter and one number" |
| TC14| Password          | Valid password (boundary - exactly 8 chars)  | "Abcdef12"                           | No error shown                                                 |
| TC15| Confirm Password  | Empty confirm password                       | ""                                   | Error: "Please confirm your password"                          |
| TC16| Confirm Password  | Confirm password does not match password     | password="Abcdef12", confirm="Abcdef13" | Error: "Passwords do not match"                            |
| TC17| Confirm Password  | Confirm password matches password            | password="Abcdef12", confirm="Abcdef12" | No error shown                                             |
| TC18| Form              | All fields valid – successful submission     | Valid name, email, password, confirm | Message: "Registration successful!" and form resets          |
| TC19| Name              | Name with leading/trailing spaces            | "  John Doe  "                       | Trimmed and accepted as valid (No error shown)                 |
| TC20| Form              | Multiple invalid fields submitted together   | All fields empty                     | All four error messages displayed simultaneously               |
