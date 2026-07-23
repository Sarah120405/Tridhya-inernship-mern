import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { renderWithStore } from "../test-utils";
import ProductList from "../pages/ProductList";
import productReducer from "../store/slice/productSlice";
import {Navbar} from '../pages/Layout/Navbar'
import userEvent from "@testing-library/user-event";
import cartReducer from "../store/slice/cartSlice";
import { Toaster } from "react-hot-toast";

const mockProducts = [
  { id: 1, title: "Test Shirt", price: 20, category: "men's clothing", image: "shirt.jpg", rating: { rate: 4.5 } },
  { id: 2, title: "Test Watch", price: 100, category: "electronics", image: "watch.jpg", rating: { rate: 4.0 } },
];

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    })
  );
});

afterEach(() => {
    vi.clearAllMocks();
});

describe("ProductList", () => {
  it("shows a loading state, then displays fetched products", async () => {
    renderWithStore(<ProductList />, {
      reducers: { productSlice: productReducer },
    });

    // loading state should appear first
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // wait for the fetch (mocked) to resolve and products to appear
    await waitFor(() => {
      expect(screen.getByText("Test Shirt")).toBeInTheDocument();
      
    });
    const shirtCard = screen.getByText("Test Shirt").closest("div");
    expect(shirtCard).toHaveTextContent("₹20");
    expect(shirtCard).toHaveTextContent("men's clothing");
    expect(shirtCard).toHaveTextContent("4.5");


  });

  it("filters products by search term", async () => {
  renderWithStore(<ProductList />, {
    reducers: { productSlice: productReducer },
  });

  await waitFor(() => {
    expect(screen.getByText("Test Shirt")).toBeInTheDocument();
  });

  // both products visible before searching
  expect(screen.getByText("Test Watch")).toBeInTheDocument();

  const searchInput = screen.getByPlaceholderText("Search ....");
  await userEvent.type(searchInput, "Shirt");

  expect(screen.getByText("Test Shirt")).toBeInTheDocument();
  expect(screen.queryByText("Test Watch")).not.toBeInTheDocument();
});

it("filters products by category", async () => {

  renderWithStore(<ProductList />, {
    reducers: { productSlice: productReducer },
  });

  await waitFor(() => {
    expect(screen.getByText("Test Shirt")).toBeInTheDocument();
  });

  const categorySelect = screen.getByRole("combobox");
  await userEvent.selectOptions(categorySelect, "electronics");

  expect(screen.getByText("Test Watch")).toBeInTheDocument();
  expect(screen.queryByText("Test Shirt")).not.toBeInTheDocument();
});

it("shows a no-results message when search matches nothing", async () => {

  renderWithStore(<ProductList />, {
    reducers: { productSlice: productReducer },
  });

  await waitFor(() => {
    expect(screen.getByText("Test Shirt")).toBeInTheDocument();
  });

  const searchInput = screen.getByPlaceholderText("Search ....");
  await userEvent.type(searchInput, "nonexistentproduct");

  expect(screen.getByText("No products match your search.")).toBeInTheDocument();
});

  it("shows an error message and retry button when the fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    renderWithStore(<ProductList />, {
      reducers: { productSlice: productReducer },
    });

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

 
it("adds a product to the cart and increments the Navbar cart badge when 'Add to cart' is clicked", async () => {
  const { store } = renderWithStore(
    <>
      <Navbar />
      <ProductList />
      <Toaster />
    </>,
    {
      reducers: { productSlice: productReducer, cartSlice: cartReducer },
    }
  );

  await waitFor(() => {
    expect(screen.getByText("Test Shirt")).toBeInTheDocument();
  });

  // badge should not be visible with an empty cart (per your itemCount > 0 guard)
  expect(screen.queryByText("1")).not.toBeInTheDocument();

  const shirtCard = screen.getByTestId("product-card-1");
  const addButton = within(shirtCard).getByRole("button", { name: /add to cart/i });

  await userEvent.click(addButton);

  // badge should now show 1
  expect(await screen.findByText("1")).toBeInTheDocument();

  const cartItems = store.getState().cartSlice.items;
  expect(cartItems).toHaveLength(1);
  expect(cartItems[0].id).toBe(1);

  expect(await screen.findByText(/added to cart/i)).toBeInTheDocument();
});
});