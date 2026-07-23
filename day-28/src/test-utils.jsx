import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

export function renderWithStore(ui, { reducers, preloadedState } = {}) {
  const store = configureStore({
    reducer: reducers,
    preloadedState,
  });

  return {
    ...render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>),
    store,
  };
}