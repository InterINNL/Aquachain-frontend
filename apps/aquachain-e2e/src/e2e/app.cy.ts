describe('aquachain-e2e', () => {
  it('should show InterINNL on the hub root', () => {
    cy.visit('/');
    cy.get('h2').first().should('contain.text', 'Mission');
    cy.contains('InterINNL').should('exist');
  });

  it('should show AquaChain under /aquachain', () => {
    cy.visit('/aquachain');
    cy.get('h1').should('contain.text', 'AquaChain');
  });
});
