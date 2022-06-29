import CartBtn from "../../components/buttons/CartBtn";
import ButtonCloseUi from "../../components/buttons/ButtonCloseUi";
import HamburgerBtn from "../../components/buttons/HamburgerBtn";
import Userbtn from "../../components/buttons/Userbtn";

describe("Cart Button", () => {
  it("should mount the component de cart button icon", () => {
    cy.mount(<CartBtn className={cy.spy()} />);

    cy.get("[data-test='cart-button']").click();
  });
});

describe("Close UI Button", () => {
  it("should mount the component de cart button icon", () => {
    cy.mount(<ButtonCloseUi className={cy.spy()} />);

    cy.get("[data-test='closeui-button']").click();
  });
});

describe("Hamburger Button", () => {
  it("should mount the component de cart button icon", () => {
    cy.mount(<HamburgerBtn />);

    cy.get("[data-test='hamburger-button']").click();
  });
});

describe("User Button", () => {
  it("should mount the component de cart button icon", () => {
    cy.mount(<Userbtn className={cy.spy()} />);

    cy.get("[data-test='usericon-button']").click();
  });
});
