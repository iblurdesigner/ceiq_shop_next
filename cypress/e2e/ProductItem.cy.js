beforeEach(() => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  cy.visit("http://localhost:3000");
});

describe("Click on some product item", () => {
  it("Verify it click on the correct product item", () => {
    cy.get("[data-test='name-productitem']").click({
      multiple: true,
      force: true,
    });
    cy.get("[data-test='desc-title']").should("have.text", "Descripción:");
  });

  it("If the page is about product item it should have text: Regresar a productos and then click to add", () => {
    cy.get("[data-test='name-productitem']").click({
      multiple: true,
      force: true,
    });

    cy.get("[data-test='text-return']").should(
      "have.text",
      "Regresar a productos"
    );
  });
});
