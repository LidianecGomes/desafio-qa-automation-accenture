/**
 * Page Object: Alerts, Frame & Windows > Browser Windows
 *
 * O Cypress roda os testes dentro de uma única aba e não controla novas janelas.
 * A estratégia recomendada pela própria documentação do Cypress é:
 *   1. "Espionar" (stub) o window.open para provar que a nova janela foi solicitada;
 *   2. Abrir a URL que seria aberta na nova janela, na mesma aba, e validar o conteúdo;
 *   3. "Fechar" a janela voltando para a página original.
 */
class BrowserWindowsPage {
  elementos = {
    botaoNovaJanela: () => cy.get('#windowButton'),
    tituloPaginaExemplo: () => cy.get('#sampleHeading'),
  };

  validarPagina() {
    cy.url().should('include', '/browser-windows');
  }

  clicarNovaJanela() {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('novaJanela');
    });
    this.elementos.botaoNovaJanela().click();
  }

  validarNovaJanelaAberta() {
    cy.get('@novaJanela').should('have.been.calledOnce');
    cy.get('@novaJanela')
      .its('firstCall.args.0')
      .should('contain', '/sample')
      .then((url) => {
        // Abre o conteúdo da "nova janela" para validar a mensagem.
        cy.visit(url);
      });
  }

  validarMensagem(mensagem) {
    this.elementos.tituloPaginaExemplo().should('have.text', mensagem);
  }

  fecharNovaJanela() {
    cy.go('back');
    this.validarPagina();
  }
}

export default new BrowserWindowsPage();
