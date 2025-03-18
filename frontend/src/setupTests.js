// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toBeInTheDocument();
import '@testing-library/jest-dom';

// Silence the error messages about canvas in the console
beforeAll(() => {
  const originalError = console.error;
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Not implemented: HTMLCanvasElement.prototype.getContext') ||
       args[0].includes('Failed to create chart'))
    ) {
      return;
    }
    return originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error.mockRestore();
});
