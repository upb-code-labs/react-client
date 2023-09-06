describe("Home page tests", () => {
  it("Should have a button", () => {
    cy.visit("/")
    cy.get("button").should("have.text", "Home")
  })
})