import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithStore } from "../test-utils";
import Checkout from "../pages/Checkout";
import cartReducer from "../store/slice/cartSlice";
import checkoutReducer from "../store/slice/checkoutSlice";
import ordersReducer from "../store/slice/orderSlice";

const mockItem = {
  id: 1,
  name: "Test Product",
  price: 100,
  quantity: 2,
  image: "test.jpg",
};

describe("Checkout flow", () => {
  it("blocks submission when required fields are empty", async () => {
    window.alert = vi.fn(); // your handleSubmit uses alert() for validation

    const { store } = renderWithStore(<Checkout />, {
      reducers: { cartSlice: cartReducer, checkoutSlice: checkoutReducer, ordersSlice: ordersReducer },
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    await userEvent.click(screen.getByText("Place Order"));

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields before placing your order");
    expect(store.getState().ordersSlice.list).toHaveLength(0);
  });

  it("shows a confirmation dialog before placing the order, and places it on confirm", async () => {
    const { store } = renderWithStore(<Checkout />, {
      reducers: { cartSlice: cartReducer, checkoutSlice: checkoutReducer, ordersSlice: ordersReducer },
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    await userEvent.type(screen.getByPlaceholderText("Enter your name..."), "Sarah");
    await userEvent.type(screen.getByPlaceholderText("Enter address..."), "123 Test St");
    await userEvent.selectOptions(screen.getByRole("combobox"), "UPI");

    await userEvent.click(screen.getByText("Place Order"));

    // confirmation dialog should appear, order not yet placed
    expect(screen.getByText("Confirm your order?")).toBeInTheDocument();
    expect(store.getState().ordersSlice.list).toHaveLength(0);

    await userEvent.click(screen.getByText("Confirm"));
    expect(await screen.findByText("Order placed!")).toBeInTheDocument();
    const priceMatches = await screen.findAllByText(/₹200/);
    expect(priceMatches.length).toBeGreaterThan(0); // at least one instance updated correctly
    expect(screen.getByText(/Test Product/)).toBeInTheDocument();

    // order placed, cart cleared, checkout form reset
    const orders = store.getState().ordersSlice.list;
    expect(orders).toHaveLength(1);
    expect(orders[0].total).toBe(200);
    expect(store.getState().cartSlice.items).toHaveLength(0);
    expect(store.getState().checkoutSlice.name).toBe("");
  });

  it("cancels the order when Cancel is clicked in the confirmation dialog", async () => {
    const { store } = renderWithStore(<Checkout />, {
      reducers: { cartSlice: cartReducer, checkoutSlice: checkoutReducer, ordersSlice: ordersReducer },
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    await userEvent.type(screen.getByPlaceholderText("Enter your name..."), "Sarah");
    await userEvent.type(screen.getByPlaceholderText("Enter address..."), "123 Test St");
    await userEvent.selectOptions(screen.getByRole("combobox"), "UPI");
    await userEvent.click(screen.getByText("Place Order"));
    await userEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Confirm your order?")).not.toBeInTheDocument();
    expect(store.getState().ordersSlice.list).toHaveLength(0);
    expect(store.getState().cartSlice.items).toHaveLength(1); // cart untouched
  });
});