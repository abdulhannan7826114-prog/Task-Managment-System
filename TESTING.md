# Testing Guide

Comprehensive testing setup for the Task Management App using Jest (backend) and Vitest (frontend).

## Backend Testing (Jest)

### Setup

Jest is configured in `jest.config.js` with the following features:
- Unit tests for controllers
- Integration tests for API routes
- Code coverage reports
- Mocking and spying support

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

Tests are located in `__tests__` directory:

```
backend/
├── __tests__/
│   ├── controllers/
│   │   ├── auth.test.js
│   │   └── task.test.js
│   └── middleware/
│       └── auth.test.js
```

### Example Test

```javascript
import request from 'supertest';
import app from '../../server.js';

describe('Auth Controller', () => {
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

### Testing Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `beforeEach` and `afterEach` hooks
3. **Descriptive Names**: Use clear test descriptions
4. **AAA Pattern**: Arrange, Act, Assert
5. **Mock External Services**: Mock database calls when needed

### Coverage Thresholds

Current coverage requirements:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

Update in `jest.config.js` for stricter requirements.

## Frontend Testing (Vitest)

### Setup

Vitest is configured with:
- Component testing with React Testing Library
- Unit tests for hooks
- Code coverage reports
- Fast parallel execution

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Watch mode
npm test -- --watch

# UI mode
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Structure

Tests are located in `src/__tests__`:

```
frontend/src/
├── __tests__/
│   ├── components/
│   │   ├── TaskCard.test.jsx
│   │   ├── TaskForm.test.jsx
│   │   └── TaskList.test.jsx
│   ├── hooks/
│   │   ├── useAuth.test.js
│   ├── setup.js
```

### Example Test

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../components/TaskCard';

describe('TaskCard Component', () => {
  const mockTask = {
    _id: '1',
    title: 'Test Task',
    status: 'Todo',
    priority: 'High'
  };

  it('should render task card with title', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on user interactions
2. **Use React Testing Library**: Avoid testing internal state
3. **Mock External APIs**: Mock axios and API calls
4. **Test User Interactions**: Use `fireEvent` or `userEvent`
5. **Avoid Snapshots**: Prefer specific assertions

## Integration Testing

### API Testing with Postman

1. Import `POSTMAN_COLLECTION.json`
2. Configure environment variables
3. Run collections to test endpoints
4. Automate with Newman:

```bash
npm install -g newman

newman run POSTMAN_COLLECTION.json \
  --environment environment.json \
  --reporters cli,json
```

### End-to-End Testing

For E2E testing, consider:
- **Cypress**: `npm install cypress`
- **Playwright**: `npm install @playwright/test`

Example Cypress test:

```javascript
describe('Task Management App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should login and create a task', () => {
    cy.get('[data-testid=email-input]').type('test@example.com');
    cy.get('[data-testid=password-input]').type('password123');
    cy.get('[data-testid=login-btn]').click();

    cy.get('[data-testid=add-task-btn]').click();
    cy.get('[data-testid=task-title]').type('New Task');
    cy.get('[data-testid=create-btn]').click();

    cy.get('[data-testid=task-card]').should('contain', 'New Task');
  });
});
```

## Continuous Integration Testing

### GitHub Actions

Tests run automatically on:
- Push to main/develop branches
- Pull requests

Workflows defined in `.github/workflows/`:

```yaml
# Tests run in parallel
jobs:
  test-backend:
    # Jest tests with MongoDB
  test-frontend:
    # Vitest tests with React Testing Library
```

### Local Pre-commit Testing

Set up git hooks:

```bash
# Install husky
npm install husky --save-dev

# Setup husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

## Code Coverage

### Viewing Coverage

```bash
# Backend
cd backend
npm run test:coverage
open coverage/lcov-report/index.html

# Frontend
cd frontend
npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Goals

- Aim for >80% coverage
- Critical paths should be >90%
- Consider coverage trends over time

## Test Data Management

### Fixtures

Create reusable test data:

```javascript
// backend/__tests__/fixtures/users.js
export const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

export const mockTask = {
  title: 'Test Task',
  description: 'Test Description',
  status: 'Todo'
};
```

### Factories

For dynamic test data:

```javascript
function createTask(overrides = {}) {
  return {
    title: 'Default Task',
    status: 'Todo',
    priority: 'Medium',
    ...overrides
  };
}
```

## Debugging Tests

### Backend Debugging

```bash
# Debug in VS Code
node --inspect-brk node_modules/.bin/jest

# In VS Code launch.json:
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### Frontend Debugging

```bash
# Debug with Vitest UI
npm run test:ui

# VS Code debugger
# Add breakpoints and run tests in debug mode
```

## Common Testing Patterns

### Testing API Endpoints

```javascript
test('POST /api/tasks should create task', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send(taskData);

  expect(res.statusCode).toBe(201);
  expect(res.body.task._id).toBeDefined();
});
```

### Testing React Hooks

```javascript
test('useAuth should update user on login', () => {
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

  act(() => {
    result.current.login(mockUser, mockToken);
  });

  expect(result.current.user).toEqual(mockUser);
});
```

### Testing Async Code

```javascript
test('should fetch tasks', async () => {
  const { result } = renderHook(() => useTasks());

  await waitFor(() => {
    expect(result.current.tasks).toHaveLength(2);
  });
});
```

### Mocking API Calls

```javascript
// Frontend
vi.mock('../../utils/api', () => ({
  taskAPI: {
    getTasks: vi.fn(() => Promise.resolve({ data: { tasks: [] } }))
  }
}));
```

## Performance Testing

### Load Testing

Use Apache JMeter or Artillery:

```bash
npm install -g artillery

artillery quick --count 100 --num 10 http://localhost:5000/api/tasks
```

### Memory Leak Detection

```javascript
// Jest
afterAll(() => {
  const used = process.memoryUsage();
  console.log('Memory usage:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024)} MB`);
  }
});
```

## Troubleshooting

### Common Issues

1. **Tests timeout**
   - Increase timeout: `jest.setTimeout(10000)`
   - Check async code completion

2. **Cannot find module**
   - Verify imports
   - Check module aliases in `jest.config.js`

3. **Database connection fails**
   - Ensure MongoDB is running
   - Check connection string in test env

4. **React Testing Library warnings**
   - Wrap state changes in `act()`
   - Clean up after tests properly

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)

---

For questions or issues with testing, open an issue in the repository.
