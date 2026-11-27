/**
 * Page Object: Elements > Web Tables
 *
 * Para localizar um registro usamos a caixa de busca da tabela. Assim o teste
 * não depende da paginação (a tabela mostra só 10 linhas por página).
 */
const LINHA = '.rt-tbody .rt-tr-group, table tbody tr';

class WebTablesPage {
  elementos = {
    botaoAdicionar: () => cy.get('#addNewRecordButton'),
    busca: () => cy.get('#searchBox'),
    nome: () => cy.get('#firstName'),
    sobrenome: () => cy.get('#lastName'),
    email: () => cy.get('#userEmail'),
    idade: () => cy.get('#age'),
    salario: () => cy.get('#salary'),
    departamento: () => cy.get('#department'),
    botaoSubmit: () => cy.get('#submit'),
    modal: () => cy.get('.modal-content'),
    linhaComTexto: (texto) => cy.contains(LINHA, texto),
  };

  validarPagina() {
    cy.url().should('include', '/webtables');
  }

  preencherCampos(registro) {
    this.elementos.nome().clear().type(registro.nome);
    this.elementos.sobrenome().clear().type(registro.sobrenome);
    this.elementos.email().clear().type(registro.email);
    this.elementos.idade().clear().type(registro.idade);
    this.elementos.salario().clear().type(registro.salario);
    this.elementos.departamento().clear().type(registro.departamento);
    this.elementos.botaoSubmit().click();
    this.elementos.modal().should('not.exist');
  }

  criarRegistro(registro) {
    this.elementos.botaoAdicionar().click();
    this.preencherCampos(registro);
  }

  buscar(texto) {
    this.elementos.busca().clear().type(texto);
  }

  limparBusca() {
    this.elementos.busca().clear();
  }

  validarRegistro(registro) {
    this.buscar(registro.email);
    this.elementos.linhaComTexto(registro.email).within(() => {
      cy.contains(registro.nome);
      cy.contains(registro.sobrenome);
      cy.contains(registro.idade);
      cy.contains(registro.salario);
      cy.contains(registro.departamento);
    });
    this.limparBusca();
  }

  editarRegistro(emailAtual, novosDados) {
    this.buscar(emailAtual);
    this.elementos.linhaComTexto(emailAtual).find('[title="Edit"]').click();
    this.preencherCampos(novosDados);
    this.limparBusca();
  }

  excluirRegistro(email) {
    this.buscar(email);
    this.elementos.linhaComTexto(email).find('[title="Delete"]').click();
    this.limparBusca();
  }

  validarRegistroInexistente(email) {
    this.buscar(email);
    cy.contains(LINHA, email).should('not.exist');
    this.limparBusca();
  }
}

export default new WebTablesPage();
