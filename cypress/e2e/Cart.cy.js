beforeEach(() => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  cy.visit("http://localhost:3000/cart");
  cy.get("[data-test='go-buy']").click();
  cy.get("[data-test='name-productitem']").click({
    multiple: true,
    force: true,
  });
  cy.get("[data-test='button-add']")
    .should("have.text", "Añadir al carrito")
    .click({ force: true });
});

describe("Cart", () => {
  it("Buy a product and verify the value", () => {
    cy.get("[data-test='value-button']")
      .click({ force: true })
      .should("have.value", "");
  });
  it("Delete an item and should have a text", () => {
    cy.get("[data-test='delete-button']").click({ force: true });
    cy.contains(/Carrito de compras/i).should("be.visible");
    cy.contains(/El carrito se encuentra vacío./i).should("be.visible");
  });

  it("Buy the product", () => {
    cy.get("[data-test='buy-button']").click({ force: true });
  });
});
