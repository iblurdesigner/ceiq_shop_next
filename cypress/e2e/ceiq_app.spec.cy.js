describe("CEIQ shop its alive", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("frontpage can be opened", () => {
    cy.contains("Productos más vendidos");
  });

  it("user can be logged", () => {
    cy.contains("Ingresar").click();
    cy.get('[name="email"]').type("admin@marlin.com");
    cy.get('[name="password"]').type("123456");
    cy.get(".bg-green").click();
    cy.contains("Productos más vendidos");
  });
});
