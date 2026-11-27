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

  /**
   * Seleciona a maior opção de "linhas por página" para todos os registros
   * ficarem visíveis sem precisar da busca nem trocar de página.
   */
  mostrarTodasAsLinhas() {
    cy.get('body').then(($body) => {
      const $select = $body
        .find('select')
        .filter((_, el) => [...el.options].some((op) => /\d+/.test(op.text)));
      if (!$select.length) {
        cy.log('Seletor de linhas por página não encontrado');
        return;
      }
      // As opções vêm como "Show 10", "Show 20"...: extrai só o número.
      const numero = (op) => parseInt(op.text.replace(/\D/g, ''), 10) || 0;
      const maiorOpcao = [...$select[0].options].reduce((maior, op) =>
        (numero(op) > numero(maior) ? op : maior));
      cy.wrap($select.first()).select(maiorOpcao.value);
    });
  }

  // Editar e excluir são feitos SEM a busca ativa: no demoqa, excluir um registro
  // com a busca filtrada apaga também os registros que não aparecem no filtro.
  editarRegistro(emailAtual, novosDados) {
    this.limparBusca();
    this.mostrarTodasAsLinhas();
    this.elementos.linhaComTexto(emailAtual).find('[title="Edit"]').click();
    this.preencherCampos(novosDados);
  }

  // Conta só as linhas preenchidas (as vazias de preenchimento não têm "@").
  contarRegistros() {
    return cy.get('body').then(($body) => $body.find(LINHA).filter(':contains("@")').length);
  }

  excluirRegistro(email) {
    this.limparBusca();
    this.mostrarTodasAsLinhas();
    this.contarRegistros().then((antes) => {
      cy.log(`Registros antes de excluir ${email}: ${antes}`);
      this.elementos.linhaComTexto(email).find('[title="Delete"]').click();
      cy.contains(LINHA, email).should('not.exist');
      // Excluir um registro deve remover exatamente uma linha da tabela.
      this.contarRegistros().should('eq', antes - 1);
    });
  }

  /**
   * Exclui o registro se ele ainda estiver na tabela. Por causa do bug do demoqa
   * (excluir um registro novo apaga todos os outros registros novos), alguns já
   * podem ter sumido junto com o anterior.
   */
  excluirSeExistir(email) {
    this.limparBusca();
    this.mostrarTodasAsLinhas();
    cy.get('body').then(($body) => {
      const existe = $body.find(LINHA).filter(`:contains("${email}")`).length > 0;
      if (existe) {
        this.elementos.linhaComTexto(email).find('[title="Delete"]').click();
        cy.contains(LINHA, email).should('not.exist');
      } else {
        cy.log(`${email} já tinha sido removido junto com outro registro (bug do demoqa)`);
      }
    });
  }

  validarRegistroExistente(email) {
    this.buscar(email);
    this.elementos.linhaComTexto(email).should('exist');
    this.limparBusca();
  }

  validarRegistroInexistente(email) {
    this.buscar(email);
    cy.contains(LINHA, email).should('not.exist');
    this.limparBusca();
  }
}

export default new WebTablesPage();
