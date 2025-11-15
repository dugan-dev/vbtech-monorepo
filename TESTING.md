# Testing Guide

This project uses Vitest for unit testing. Tests have been added for the physician management and UM case features.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
cd packages/utils && pnpm test
cd apps/vbum && pnpm test
```

## Test Structure

### Utility Function Tests
- `packages/utils/src/format-currency.test.ts` - Comprehensive tests for currency formatting

### Schema Validation Tests
- `apps/vbum/app/(authed)/admin/physicians/components/physician-form/physician-form-schema.test.ts`
- `apps/vbum/components/worklist/case-form-schema.test.ts`

### Utility Tests
- `apps/vbum/utils/get-page-title.test.tsx`
- `apps/vbum/components/main-sidebar/main-sidebar-config.test.ts`

## Test Coverage

The tests cover:
- ✅ Happy path scenarios
- ✅ Edge cases (boundary values, empty strings, maximum lengths)
- ✅ Error conditions (invalid inputs, missing required fields)
- ✅ Type coercion (string to number conversion)
- ✅ Transformation logic (empty string to undefined)
- ✅ Validation rules (min/max constraints, format validation)
- ✅ Default values verification
- ✅ Configuration structure validation

## Writing New Tests

When adding new tests, follow these conventions:

1. Use descriptive test names that explain what is being tested
2. Group related tests using `describe` blocks
3. Test both happy paths and error cases
4. Use type-safe assertions
5. Mock external dependencies appropriately

Example:
```typescript
import { describe, expect, it } from 'vitest'

describe('MyFunction', () => {
  describe('valid inputs', () => {
    it('should handle normal case correctly', () => {
      const result = myFunction('input')
      expect(result).toBe('expected')
    })
  })

  describe('invalid inputs', () => {
    it('should throw error for empty input', () => {
      expect(() => myFunction('')).toThrow()
    })
  })
})
```

## Mocking

The test setup includes mocks for:
- `server-only` module
- `next/navigation` hooks
- `next/cache` functions
- React's `cache` function

See `apps/vbum/vitest.setup.ts` for the complete mock configuration.

## Future Improvements

Consider adding:
1. Integration tests for repository functions (requires test database)
2. Component tests with React Testing Library
3. E2E tests with Playwright
4. Snapshot tests for UI components
5. Performance benchmarks for critical functions