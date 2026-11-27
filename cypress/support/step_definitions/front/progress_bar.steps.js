import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import ProgressBarPage from '../../pages/ProgressBarPage';

When('eu clico no botão Start', () => {
  ProgressBarPage.validarPagina();
  ProgressBarPage.clicarStart();
});

When('paro a barra antes de chegar a {int}%', (limite) => {
  ProgressBarPage.pararAntesDe(limite);
});

Then('o valor da barra deve ser menor ou igual a {int}%', (limite) => {
  ProgressBarPage.validarValorMenorOuIgual(limite);
});

When('eu clico no botão Start novamente', () => {
  ProgressBarPage.clicarStart();
});

When('a barra chega a {int}%', (valor) => {
  ProgressBarPage.aguardarChegarEm(valor);
});

Then('eu reseto a barra de progresso', () => {
  ProgressBarPage.resetar();
});

Then('o valor da barra deve ser {int}%', (valor) => {
  ProgressBarPage.validarValor(valor);
});
