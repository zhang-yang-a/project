# Testing Documentation

This project includes unit tests for both frontend and backend components.

## Test Structure

```
/tests/
├── run_all_tests.php          # PHP test runner
├── run_tests.js               # JavaScript test runner (placeholder)
└── unit/
    ├── HelloWorld.vue.test.js # Vue component tests
    ├── HelloWorld.test.jsx    # React component tests
    ├── ConnTest.php           # Database connection tests
    ├── LoginTest.php          # Login functionality tests
    └── RegisterTest.php       # Registration functionality tests
```

## Frontend Tests

### Vue Component Tests
Located in: `/tests/unit/HelloWorld.vue.test.js`

To run these tests, you would need:
```bash
npm install --save-dev @vue/test-utils jest
npm test
```

### React Component Tests
Located in: `/tests/unit/HelloWorld.test.jsx`

To run these tests, you would need:
```bash
npm install --save-dev @testing-library/react jest
npm test
```

## Backend Tests

### PHP Tests
Located in: `/tests/unit/`

The PHP tests include:
- Database connection tests
- User registration tests
- User login tests

To run the PHP tests:
```bash
php tests/run_all_tests.php
```

## Test Coverage

### Vue Component (HelloWorld.vue)
- Renders correct message
- Has correct initial data
- Renders welcome message
- Has correct element structure

### React Component (HelloWorld.jsx)
- Renders correct text
- Renders single h1 element
- Has correct DOM structure

### PHP Backend
- Database connection functionality
- User login with valid/invalid credentials
- User registration with various inputs
- SQL query formation verification

## Security Considerations

Note: The original PHP code has SQL injection vulnerabilities. The tests demonstrate the current behavior but in a production environment, you should:

1. Use prepared statements instead of direct string interpolation
2. Validate and sanitize all user inputs
3. Implement proper error handling
4. Use HTTPS for sensitive operations

## Running All Tests

To run all tests, execute:
```bash
# For PHP tests
php tests/run_all_tests.php

# For JavaScript tests (after installing dependencies)
npm test
```