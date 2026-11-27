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

  /**
   * Confirma que o Reset foi aplicado: o botão volta a ser "Start" e a barra sai dos 100%.
   * Não valida o valor exato porque, por um bug do demoqa, se o Reset é clicado logo
   * que a barra chega a 100%, ela volta a subir sozinha (ver cenário @bug e o README).
   */
  validarReiniciada() {
    this.elementos.botaoReset().should('not.exist');
    this.elementos.botaoStartStop().should('have.text', 'Start');
    this.elementos.barra().invoke('attr', 'aria-valuenow').should('not.eq', '100');
  }

  /**
   * Verifica que a barra continua no valor esperado depois de um tempo parada.
   * A espera fixa é intencional: o que se valida é a permanência do valor.
   */
  validarValorApos(valor, segundos) {
    cy.wait(segundos * 1000);
    this.elementos.barra().invoke('attr', 'aria-valuenow').then((atual) => {
      expect(atual, `valor da barra após ${segundos}s parada`).to.eq(String(valor));
    });
  }
}

export default new ProgressBarPage();
