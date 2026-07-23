import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithStore } from "../test-utils";
import CartItem from "../components/CartPages/CartItem";
import cartReducer from "../store/slice/cartSlice";
import Cart from '../pages/Cart'

const mockItem = {
  id: 1,
  name: "Test Product",
  price: 100,
  quantity: 2,
  image: "test.jpg",
};

describe("CartSummary integration", () => {
  it("updates total items and price when quantity increases", async () => {
    renderWithStore(<Cart />, {
      reducers: { cartSlice: cartReducer },
      preloadedState: { cartSlice: { items: [mockItem] } }, // quantity: 2, price: 100
    });

    // initial state: 2 items, total ₹200
    expect(screen.getByText(/Items \(2\)/)).toBeInTheDocument();
    // in your test
    expect(screen.getByTestId("cart-total")).toHaveTextContent("200");
    await userEvent.click(screen.getByText("+"));

    // after increment: 3 items, total ₹300
    expect(await screen.findByText(/Items \(3\)/)).toBeInTheDocument();
    expect(screen.getByTestId("cart-total")).toHaveTextContent("300");
  });

  it("updates total items and price when quantity decreases", async () => {
    renderWithStore(<Cart />, {
      reducers: { cartSlice: cartReducer },
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    await userEvent.click(screen.getByText("−"));

    expect(await screen.findByText(/Items \(1\)/)).toBeInTheDocument();
    expect(screen.getByTestId("cart-total")).toHaveTextContent("100");
  });

  it("updates total items and shows empty cart message after removing the only item", async () => {
    renderWithStore(<Cart />, {
      reducers: { cartSlice: cartReducer },
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    await userEvent.click(screen.getByText("Remove"));

    expect(await screen.findByText("Cart is empty")).toBeInTheDocument();
  });
});