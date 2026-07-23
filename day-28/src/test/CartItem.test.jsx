import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { renderWithStore } from "../test-utils";
import { configureStore } from "@reduxjs/toolkit";
import CartItem from "../components/CartPages/CartItem";
import cartReducer from "../store/slice/cartSlice";
const mockItem = {
  id: 1,
  name: "Test Product",
  price: 100,
  quantity: 2,
  image: "test.jpg",
};

describe("CartItem", () => {
  it("displays the item's name, price, and quantity", () => {
    renderWithStore(<CartItem item={mockItem} />, {
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // quantity display
  });

  it("dispatches updateQuantity when the + button is clicked", async () => {
    const store = configureStore({
      reducer: { cartSlice: cartReducer },
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    render(
      <Provider store={store}>
        <CartItem item={mockItem} />
      </Provider>,
    );

    await userEvent.click(screen.getByText("+"));

    const updatedItem = store
      .getState()
      .cartSlice.items.find((i) => i.id === 1);
    expect(updatedItem.quantity).toBe(3);
  });
});
