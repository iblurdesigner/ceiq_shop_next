// import React from 'react';
// import Login from '../../pages/login';

beforeEach(() => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  cy.visit("http://localhost:3000/login");
});

describe("Login", () => {
  it("should visit login and enter", () => {
    cy.contains(/Ingresar/i).should("be.visible");

    cy.get("[data-test='email-input']").type("admin@marlin.com");
    cy.get("[data-test='password-input']").type("123456");
    cy.get("[data-test='submit-button']").click();
  });
});

describe("Login with admin and other user", () => {
  it("should enter with admin user", () => {
    cy.fixture("elements").then((el) => {
      cy.Login(el.admin);
      cy.get("[data-test='user-button']").click();
      cy.get("[data-test='logout-button']").click();
    });
  });
  it("should enter with user Stef", () => {
    cy.fixture("elements").then((el) => {
      cy.Login(el.stef);
      cy.get(".bg-green").click();
      cy.get("[data-test='user-button']").click();
      cy.get("[data-test='logout-button']").click();
    });
  });
});
