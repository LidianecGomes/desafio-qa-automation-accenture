/**
 * Página inicial do demoqa e menu lateral, usados por todos os cenários de front.
 */
class HomePage {
  acessar() {
    cy.visit('/');
    cy.removerAnuncios();
  }

  escolherCard(nomeCard) {
    cy.contains('.card h5', nomeCard).scrollIntoView().click();
    cy.removerAnuncios();
  }

  clicarSubmenu(nomeSubmenu) {
    cy.contains('.element-list span.text, .left-pannel span.text', nomeSubmenu)
      .scrollIntoView()
      .click();
    cy.removerAnuncios();
  }
}

export default new HomePage();
