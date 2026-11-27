/**
 * Page Object: Interactions > Sortable (aba List)
 */
const ITENS = '#demo-tabpane-list .list-group-item';

class SortablePage {
  validarPagina() {
    cy.url().should('include', '/sortable');
  }

  obterOrdemAtual() {
    return cy.get(ITENS).then(($itens) => [...$itens].map((el) => el.innerText.trim()));
  }

  /**
   * Ordena a lista via drag and drop até ficar igual a ordemDesejada.
   * Lógica (parecida com um selection sort): para cada posição i, encontra o item
   * que deveria estar ali e o arrasta para cima, até a posição i.
   * Os itens acima de i já estão corretos, então o arraste é sempre para cima.
   */
  ordenarPor(ordemDesejada, posicao = 0) {
    if (posicao >= ordemDesejada.length) return;

    this.obterOrdemAtual().then((ordemAtual) => {
      const indiceAtual = ordemAtual.indexOf(ordemDesejada[posicao]);
      if (indiceAtual !== posicao) {
        cy.get(ITENS)
          .eq(indiceAtual)
          .arrastarPara(ITENS, posicao);
      }
      this.ordenarPor(ordemDesejada, posicao + 1);
    });
  }

  validarOrdem(ordemEsperada) {
    this.obterOrdemAtual().should('deep.equal', ordemEsperada);
  }
}

export default new SortablePage();
