import "@testing-library/jest-dom";
import "@testing-library/jest-dom";

// jsdom doesn't implement matchMedia — provide a minimal fake so libraries
// that check for it (like react-hot-toast) don't crash in tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated, but some libraries still call it
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});