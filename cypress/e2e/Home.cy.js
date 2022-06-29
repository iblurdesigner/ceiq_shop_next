beforeEach(() => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  cy.visit("http://localhost:3000");
});

describe("Home", () => {
  it("Visit and verify the home page", () => {
    cy.get(".text-2xl").should("have.text", "Productos más vendidos");
  });
});

describe("Home should show product items", () => {
  it("get product item", () => {
    cy.get("[data-test='div-productitem']");
  });
});
