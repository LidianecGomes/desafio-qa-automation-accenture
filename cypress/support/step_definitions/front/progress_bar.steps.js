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

When('eu reseto a barra de progresso', () => {
  ProgressBarPage.resetar();
});

// Espera e clique no mesmo passo, sem a pausa entre passos do Cucumber:
// é o clique imediato que reproduz o bug do Reset (ver cenário @bug e README).
When('eu reseto a barra assim que ela chega a {int}%', (valor) => {
  ProgressBarPage.aguardarChegarEm(valor);
  ProgressBarPage.resetar();
});

Then('a barra deve ser reiniciada', () => {
  ProgressBarPage.validarReiniciada();
});

Then('a barra deve permanecer em {int}% após {int} segundos', (valor, segundos) => {
  ProgressBarPage.validarValorApos(valor, segundos);
});
