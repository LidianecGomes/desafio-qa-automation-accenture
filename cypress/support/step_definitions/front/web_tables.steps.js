import { When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import WebTablesPage from '../../pages/WebTablesPage';
import { gerarRegistroTabela } from '../../utils/dados';

let registro;
let registroEditado;
let registros;

Before({ tags: '@webtables' }, () => {
  registro = undefined;
  registroEditado = undefined;
  registros = [];
});

// ---------- Cenário: criar, editar e deletar um registro ----------

When('eu crio um novo registro', () => {
  WebTablesPage.validarPagina();
  registro = gerarRegistroTabela();
  WebTablesPage.criarRegistro(registro);
});

Then('o novo registro deve ser exibido na tabela', () => {
  WebTablesPage.validarRegistro(registro);
});

When('eu edito o registro criado', () => {
  // Mantém o mesmo e-mail e altera os demais campos.
  registroEditado = { ...gerarRegistroTabela(), email: registro.email };
  WebTablesPage.editarRegistro(registro.email, registroEditado);
});

Then('o registro deve ser exibido com os dados atualizados', () => {
  WebTablesPage.validarRegistro(registroEditado);
});

When('eu deleto o registro criado', () => {
  WebTablesPage.excluirRegistro(registro.email);
});

Then('o registro não deve mais ser exibido na tabela', () => {
  WebTablesPage.validarRegistroInexistente(registro.email);
});

// ---------- Bônus: 12 registros de forma dinâmica ----------

When('eu crio {int} novos registros', (quantidade) => {
  WebTablesPage.validarPagina();
  registros = Array.from({ length: quantidade }, () => gerarRegistroTabela());
  registros.forEach((novo) => WebTablesPage.criarRegistro(novo));
});

Then('os {int} registros devem ser exibidos na tabela', (quantidade) => {
  expect(registros).to.have.length(quantidade);
  registros.forEach((novo) => WebTablesPage.validarRegistro(novo));
});

When('eu deleto todos os registros criados', () => {
  registros.forEach((novo) => WebTablesPage.excluirSeExistir(novo.email));
});

Then('nenhum dos registros criados deve ser exibido na tabela', () => {
  registros.forEach((novo) => WebTablesPage.validarRegistroInexistente(novo.email));
});

// ---------- Bug conhecido: excluir um registro apaga outros ----------

When('eu deleto o primeiro registro criado', () => {
  WebTablesPage.excluirSeExistir(registros[0].email);
});

Then('os demais registros criados devem continuar na tabela', () => {
  registros.slice(1).forEach((novo) => WebTablesPage.validarRegistroExistente(novo.email));
});
