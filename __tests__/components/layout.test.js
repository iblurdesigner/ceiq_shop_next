import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Layout from "../../components/Layout";

describe("Layout", () => {
  test("shoul render Layout component", () => {
    render(<Layout />);

    const layoutElement = screen.getByTestId("test-layout");
    expect(layoutElement).toBeInTheDocument();
  });
});
