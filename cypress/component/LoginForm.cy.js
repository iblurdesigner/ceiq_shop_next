import Login from "../../pages/login";

describe("Login user", () => {
  it("should visit", () => {
    cy.mount(<Login />);

    cy.intercept("POST", "/api/users/login", {
      body: {
        message: "error",
      },
    }).as("emailSubscribe");

    cy.contains(/Ingresar/i).should("be.visible");
    cy.get("input").should("have.attr", "label", "Email");

    cy.wait("@emailSubscribe");

    cy.get("[data-test='email-input']").type("admin@marlin.com");
    cy.get("[data-test='submit-button']").click();
  });
});
