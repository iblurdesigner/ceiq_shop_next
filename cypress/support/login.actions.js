Cypress.Commands.add("Login", (username) => {
  cy.fixture("elements").then((el) => {
    cy.get("[data-test='email-input']").should("be.visible").type(username);
    cy.get("[data-test='password-input']")
      .should("be.visible")
      .type(el.password);
    cy.get("[data-test='submit-button']").should("be.visible").click();
  });
});
