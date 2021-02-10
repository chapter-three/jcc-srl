const desktop = [1920, 1080];

describe('SRL CI', () => {

  it("Links to Find a court form", () => {
    cy.setResolution(desktop);
    cy.visit('/');
    cy.contains('Find a court form').click();
  });

  it("Allows user feedback on divorce page", () => {
    cy.setResolution(desktop);
    cy.visit('/divorce-california-0');
    cy.get('.jcc-feedback [data-feedback="trigger"]')
      .click();
    cy.get('label[for="edit-was-this-information-helpful-yes"]')
      .click();
    cy.get('input[name="email_optional_"]')
      .type('test@email.com');
  });

  it("Has no detectable a11y violations", () => {
    cy.setResolution([1920, 1080]);
    cy.visit('/divorce-california-0');
    cy.injectAxe();
    cy.checkA11y();
  });
});
