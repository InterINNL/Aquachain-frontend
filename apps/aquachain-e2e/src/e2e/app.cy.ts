import { getGreeting } from '../support/app.po';

describe('aquachain-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h1').should('contain.text', 'Aquachain');
  });
});
