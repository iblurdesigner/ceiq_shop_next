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
  cy.visit("http://localhost:3000/shipping");
});

describe("Shipping", () => {
  it("Verify if the page is the correct", () => {
    cy.get("[data-test='title']").should("have.text", "Dirección de envío");
  });
  it("Interact with text fields and buttons", () => {
    cy.get("#fullName")
      .invoke("attr", "label", "Nombre completo (Nombre y apellidos)")
      .type("Stefany Hildago")
      .should("have.value", "Stefany Hildago")
      .get("#address")
      .invoke("attr", "label", "Dirección")
      .type("Galapagos 440")
      .should("have.value", "Galapagos 440")
      .get("#city")
      .invoke("attr", "label", "Ciudad")
      .type("Quito")
      .should("have.value", "Quito")
      .get("#postalCode")
      .invoke("attr", "label", "Código Postal")
      .type("746893")
      .should("have.value", "746893")
      .get("#country")
      .invoke("attr", "label", "País")
      .type("Ecuador")
      .should("have.value", "Ecuador");

    cy.get("[data-test='map-button']")
      .should("have.text", "Buscar en el mapa")
      .click({ force: true })
      .get("[data-test='addr-button']")
      .should("have.attr", "placeholder", "Ingrese su dirección")
      .type("Galapagos 440")
      .get("[data-test='confirm-map-button']")
      .should("have.text", "Confirmar")
      .click();
  });

  it("Text helper show an error if user dont interacts with fields", () => {
    cy.visit("http://localhost:3000/shipping")
      .get("[data-test='continue-button']")
      .should("have.text", "Continuar")
      .click()
      .get("#fullName")
      .invoke("attr", "helperText", "Nombre completo es requerido")
      .get("#address")
      .invoke("attr", "helperText", "La Dirección es requerida")
      .get("#city")
      .invoke("attr", "helperText", "La Ciudad es requerida")
      .get("#postalCode")
      .invoke("attr", "helperText", "El Código Postal es requerido")
      .get("#country")
      .invoke("attr", "helperText", "El País es requerido");
  });
});
