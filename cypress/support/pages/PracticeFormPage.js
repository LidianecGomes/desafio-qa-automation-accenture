/**
 * Page Object: Forms > Practice Form
 */
class PracticeFormPage {
  elementos = {
    nome: () => cy.get('#firstName'),
    sobrenome: () => cy.get('#lastName'),
    email: () => cy.get('#userEmail'),
    genero: (genero) => cy.contains('label[for^="gender-radio"]', new RegExp(`^${genero}$`)),
    celular: () => cy.get('#userNumber'),
    dataNascimento: () => cy.get('#dateOfBirthInput'),
    materias: () => cy.get('#subjectsInput'),
    hobby: (hobby) => cy.contains('label[for^="hobbies-checkbox"]', hobby),
    upload: () => cy.get('#uploadPicture'),
    endereco: () => cy.get('#currentAddress'),
    estado: () => cy.get('#state input'),
    cidade: () => cy.get('#city input'),
    botaoSubmit: () => cy.get('#submit'),
    modal: () => cy.get('.modal-content'),
    tituloModal: () => cy.get('#example-modal-sizes-title-lg'),
    botaoFecharModal: () => cy.get('#closeLargeModal'),
  };

  validarPagina() {
    cy.url().should('include', '/automation-practice-form');
  }

  selecionarData({ dia, mes, ano }) {
    this.elementos.dataNascimento().click();
    cy.get('.react-datepicker__year-select').select(ano);
    cy.get('.react-datepicker__month-select').select(mes);
    const diaFormatado = String(dia).padStart(3, '0');
    cy.get(`.react-datepicker__day--${diaFormatado}:not(.react-datepicker__day--outside-month)`).click();
  }

  preencherFormulario(aluno) {
    this.elementos.nome().type(aluno.nome);
    this.elementos.sobrenome().type(aluno.sobrenome);
    this.elementos.email().type(aluno.email);
    this.elementos.genero(aluno.genero).click();
    this.elementos.celular().type(aluno.celular);
    this.selecionarData(aluno.nascimento);

    aluno.materias.forEach((materia) => {
      this.elementos.materias().type(`${materia}{enter}`, { force: true });
    });

    aluno.hobbies.forEach((hobby) => this.elementos.hobby(hobby).click());

    this.elementos.upload().selectFile(`cypress/fixtures/${aluno.arquivo}`);
    this.elementos.endereco().type(aluno.endereco);
    this.elementos.estado().type(`${aluno.estado}{enter}`, { force: true });
    this.elementos.cidade().type(`${aluno.cidade}{enter}`, { force: true });
  }

  submeter() {
    this.elementos.botaoSubmit().scrollIntoView().click({ force: true });
  }

  validarPopupAberto() {
    this.elementos.modal().should('be.visible');
    this.elementos.tituloModal().should('have.text', 'Thanks for submitting the form');
  }

  validarCampoNoPopup(rotulo, valorEsperado) {
    cy.contains('.modal-body tbody tr', rotulo)
      .find('td')
      .eq(1)
      .should('contain.text', valorEsperado);
  }

  validarDadosNoPopup(aluno) {
    this.validarCampoNoPopup('Student Name', `${aluno.nome} ${aluno.sobrenome}`);
    this.validarCampoNoPopup('Student Email', aluno.email);
    this.validarCampoNoPopup('Gender', aluno.genero);
    this.validarCampoNoPopup('Mobile', aluno.celular);
    this.validarCampoNoPopup('Date of Birth', `${aluno.nascimento.mes},${aluno.nascimento.ano}`);
    this.validarCampoNoPopup('Subjects', aluno.materias.join(', '));
    this.validarCampoNoPopup('Hobbies', aluno.hobbies.join(', '));
    this.validarCampoNoPopup('Picture', aluno.arquivo);
    this.validarCampoNoPopup('Address', aluno.endereco);
    this.validarCampoNoPopup('State and City', `${aluno.estado} ${aluno.cidade}`);
  }

  fecharPopup() {
    this.elementos.botaoFecharModal().click({ force: true });
  }

  validarPopupFechado() {
    this.elementos.modal().should('not.exist');
  }
}

export default new PracticeFormPage();
