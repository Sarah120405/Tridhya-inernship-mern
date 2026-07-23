import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("sanity check", () => {
  it("renders without crashing", () => {
    render(<h1>Hello</h1>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
