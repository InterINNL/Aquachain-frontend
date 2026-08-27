describe('aquachain-e2e', () => {
  it('should show AquaChain home', () => {
    cy.visit('/');
    cy.get('h1').should('contain.text', 'AquaChain');
  });
});
