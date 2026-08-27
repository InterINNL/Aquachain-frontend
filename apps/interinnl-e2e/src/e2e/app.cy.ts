describe('interinnl-e2e', () => {
  it('should show InterINNL hub', () => {
    cy.visit('/');
    cy.contains('InterINNL').should('exist');
    cy.get('h2').first().should('contain.text', 'Mission');
  });
});
