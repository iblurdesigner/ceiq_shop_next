beforeEach(() => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  cy.visit("http://localhost:3000/login");
  cy.fixture("elements").then((el) => {
    cy.Login(el.stef);
    cy.get(".bg-green").click();
    cy.get("[data-test='user-button']").click();
  });
  cy.visit("http://localhost:3000/payment");
});

describe("Payment", () => {
  it("Verify if the page is the correct", () => {
    cy.get("[data-test='title']")
      .should("have.text", "Método de pago")
      .get("[data-test='continue-button']")
      .should("have.text", "Continuar")
      .get("[data-test='back-button']")
      .should("have.text", "Atrás")
      .get("[data-test='paypal']")
      .invoke("attr", "label", "PayPal")
      .get("[data-test='plux']")
      .invoke("attr", "label", "PagoPlux")
      .get("[data-test='efectivo']")
      .invoke("attr", "label", "Efectivo")
      .get("[data-test='crypto']")
      .invoke("attr", "label", "Crytomonedas - Ethereum");
  });

  it("Interacting with checkboxes", () => {
    cy.get("[data-test='paypal']").click();
    cy.get("[data-test='plux']").click();
    cy.get("[data-test='efectivo']").click();
    cy.get("[data-test='crypto']").click();
  });
});
