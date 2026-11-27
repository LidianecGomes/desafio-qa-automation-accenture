import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import SortablePage from '../../pages/SortablePage';

const ORDEM_CRESCENTE = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const ORDEM_DECRESCENTE = [...ORDEM_CRESCENTE].reverse();

Given('a lista está em ordem decrescente', () => {
  SortablePage.validarPagina();
  SortablePage.ordenarPor(ORDEM_DECRESCENTE);
  SortablePage.validarOrdem(ORDEM_DECRESCENTE);
});

When('eu ordeno os elementos em ordem crescente usando drag and drop', () => {
  SortablePage.ordenarPor(ORDEM_CRESCENTE);
});

Then('os elementos devem estar em ordem crescente', () => {
  SortablePage.validarOrdem(ORDEM_CRESCENTE);
});
