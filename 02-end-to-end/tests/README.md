# Testing Documentation

This directory contains integration and E2E tests for the Collaborative Coding Platform.

## Running Tests

### Integration Tests

To run the integration tests:

```bash
cd tests
npm install
npm test
```

### Watch Mode

To run tests in watch mode during development:

```bash
npm run test:watch
```

### Coverage Report

To generate a test coverage report:

```bash
npm run test:coverage
```

## Test Structure

- `integration/` - Integration tests for API and WebSocket functionality
  - `session.test.ts` - Tests for session management API endpoints
  - `collaboration.test.ts` - Tests for real-time collaboration features (WebSocket)

## Test Coverage

The integration tests cover:

- ✅ Session creation with default and custom values
- ✅ Session retrieval
- ✅ Error handling for non-existent sessions
- ✅ Health check endpoint
- ✅ Real-time code synchronization (planned)
- ✅ Multi-client collaboration (planned)

## Expected Test Results

All tests should pass with the server running properly. The test suite validates:

1. **Session Management**: Creating and retrieving sessions via REST API
2. **Error Handling**: Proper HTTP status codes and error messages
3. **Data Integrity**: Session data persists correctly
4. **WebSocket Communication**: Real-time updates across multiple clients

## Command Reference

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Notes

- Tests use the actual server implementation from `../server/src/`
- In-memory session storage is used for testing
- WebSocket tests require a running Socket.io server
