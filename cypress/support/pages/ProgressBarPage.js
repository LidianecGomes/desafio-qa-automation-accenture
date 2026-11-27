/**
 * Page Object: Widgets > Progress Bar
 */
class ProgressBarPage {
  elementos = {
    barra: (opcoes = {}) => cy.get('#progressBar [role="progressbar"]', opcoes),
    botaoStartStop: () => cy.get('#startStopButton'),
    botaoReset: () => cy.get('#resetButton'),
  };

  validarPagina() {
    cy.url().should('include', '/progress-bar');
  }

  clicarStart() {
    this.elementos.botaoStartStop().should('have.text', 'Start').click();
  }

  /**
   * Aguarda a barra chegar a um valor "seguro" (bem antes de 25%) e clica em Stop.
   * Assim existe folga suficiente para o clique acontecer antes de atingir o limite.
   */
  pararAntesDe(limite) {
    const pontoDeParada = Math.floor(limite / 2);
    this.elementos.barra().should(($barra) => {
      expect(Number($barra.attr('aria-valuenow'))).to.be.gte(pontoDeParada);
    });
    this.elementos.botaoStartStop().should('have.text', 'Stop').click();
    this.elementos.botaoStartStop().should('have.text', 'Start');
  }

  validarValorMenorOuIgual(limite) {
    this.elementos.barra().invoke('attr', 'aria-valuenow').then((valor) => {
      cy.log(`Valor da barra ao parar: ${valor}%`);
      expect(Number(valor)).to.be.lte(limite);
    });
  }

  aguardarChegarEm(valor) {
    this.elementos.barra({ timeout: 30000 }).should('have.attr', 'aria-valuenow', String(valor));
  }

  resetar() {
    this.elementos.botaoReset().click();
  }

  validarValor(valor) {
    this.elementos.barra().should('have.attr', 'aria-valuenow', String(valor));
  }
}

export default new ProgressBarPage();
