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

describe("CartItem", () => {
  it("shows the empty cart message when there are no items", () => {
    renderWithStore(<Cart />, {
      reducers: { cartSlice: cartReducer },
      preloadedState: { cartSlice: { items: [] } },
    });

    expect(screen.getByText("Cart is empty")).toBeInTheDocument();
  });
  it("displays the item's name, price, and quantity", () => {
    renderWithStore(<CartItem item={mockItem} />, {
      reducers: {cartSlice: cartReducer},
      preloadedState: { cartSlice: { items: [mockItem] } },
    });

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // quantity display
  });

   it("dispatches updateQuantity when the - button is clicked", async () => {
  const { store } = renderWithStore(<CartItem item={mockItem} />, {
    reducers: { cartSlice: cartReducer },
    preloadedState: { cartSlice: { items: [mockItem] } },
  });

  await userEvent.click(screen.getByText("−"));

  const updatedItem = store.getState().cartSlice.items.find((i) => i.id === 1);
  expect(updatedItem.quantity).toBe(1);
});

it("increments the displayed quantity when + is clicked", async () => {
  renderWithStore(<Cart />, {
    reducers: { cartSlice: cartReducer },
    preloadedState: { cartSlice: { items: [mockItem] } },
  });

  await userEvent.click(screen.getByText("+"));

  expect(await screen.findByText("3")).toBeInTheDocument();
});  

it("Remove the cart item when remove is clicked", async () => {
  renderWithStore(<Cart />, {
    reducers: { cartSlice: cartReducer },
    preloadedState: { cartSlice: { items: [mockItem] } },
  });

  await userEvent.click(screen.getByText("Remove"));
  

  expect(await screen.findByText("Cart is empty")).toBeInTheDocument();
});  

});
