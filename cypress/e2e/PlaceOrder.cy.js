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
  cy.visit("http://localhost:3000/placeorder");
});

describe("empty spec", () => {
  it("Verify if the page is the correct", () => {
    cy.get("[data-test='title']").should("have.text", "Realizar Pedido");
    cy.get("[data-test='address']").should("have.text", "Dirección de envío");
    cy.get("[data-test='method']").should("have.text", "Método de Pago");
    cy.get("[data-test='orders']").should("have.text", "Órdenes");
    cy.get("[data-test='resume']").should("have.text", "Resumen del pedido");
    cy.get("[data-test='go-button']").should("have.text", "Realizar Pedido");
  });
});
