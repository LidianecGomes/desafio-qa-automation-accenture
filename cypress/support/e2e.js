import './commands';

// Exceções do site que não têm relação com o que está sendo testado.
// Qualquer outra exceção derruba o teste, para não esconder defeitos reais.
const EXCECOES_IGNORADAS = [
  // Bug conhecido do Practice Form (popup não fecha). Ver README, bug 2.
  /findDOMNode is not a function/,
];

Cypress.on('uncaught:exception', (erro) => {
  if (EXCECOES_IGNORADAS.some((padrao) => padrao.test(erro.message))) {
    return false;
  }
  return true;
});
