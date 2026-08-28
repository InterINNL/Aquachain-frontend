describe('aquachain-e2e', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show AquaChain home hero', () => {
    cy.get('.ac-home-hero__title').should(
      'contain.text',
      'Water decisions backed by verifiable data',
    );
    cy.get('.ac-home-hero__visual img').should('be.visible');
  });

  it('should navigate via header links', () => {
    cy.get('.ac-header__link').contains('Citizen Science').click();
    cy.url().should('include', '/citizen-science');
    cy.get('.ac-module-hero__title').should('contain.text', 'Citizen Science');

    cy.get('.ac-header__link').contains('Water Well').click();
    cy.url().should('include', '/water-well-initiative');
    cy.get('.ac-module-hero__title').should(
      'contain.text',
      'Water Well Initiative',
    );

    cy.get('.ac-header__link').contains('Water Utilities').click();
    cy.url().should('include', '/water-utilities');
    cy.get('.ac-module-hero__title').should('contain.text', 'Water Utilities');
  });

  it('should show citizen science tabs', () => {
    cy.visit('/citizen-science');
    cy.get('.ac-tab-bar__tab').should('have.length.at.least', 3);
    cy.get('.ac-tab-bar__tab').first().click();
    cy.get('.ac-kpi').should('exist');
  });

  it('should show agent ops loop and x402 docs link', () => {
    cy.visit('/agent-ops');
    cy.contains('Pay · Measure · Record · Verify · Govern').should('be.visible');
    cy.contains('a', 'x402 protocol')
      .should('have.attr', 'href')
      .and('include', 'x402.org');
  });

  it('should preview local DAO executable action', () => {
    cy.visit('/local-dao');
    cy.get('#daoTag').should('exist');
    cy.get('#daoTitle').type('Yamuna turbidity bounty');
    cy.get('#daoLocation').type('Delhi, India');
    cy.get('#daoDeadline').type('1893456000');
    cy.get('#daoReward').type('5000000');
    cy.contains('If passed:').should('be.visible');
    cy.contains('Yamuna turbidity bounty').should('be.visible');
  });
});
