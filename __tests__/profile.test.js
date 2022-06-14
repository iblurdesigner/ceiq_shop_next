/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/render-result-naming-convention */
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { prettyDOM, render } from "@testing-library/react";
import Profile from "../pages/profile";

test("render the content", () => {
  const component = render(<Profile />);

  // eslint-disable-next-line testing-library/no-container
  // eslint-disable-next-line testing-library/no-node-access
  // eslint-disable-next-line testing-library/no-container
  // eslint-disable-next-line testing-library/no-node-access
  const li = component.container.querySelector("li");

  console.log(prettyDOM(li));
});

test("clicking the button calls event handler once", () => {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const component = render(<Profile addToCartHandler={() => {}} />);

  // eslint-disable-next-line testing-library/prefer-screen-queries
  const button = component.getByText("Actualizar");
  fireEvent.click(button);
});
