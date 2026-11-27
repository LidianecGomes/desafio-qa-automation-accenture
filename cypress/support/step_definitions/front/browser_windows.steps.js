import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import BrowserWindowsPage from '../../pages/BrowserWindowsPage';

When('eu clico no botão New Window', () => {
  BrowserWindowsPage.validarPagina();
  BrowserWindowsPage.clicarNovaJanela();
});

Then('uma nova janela deve ser aberta com a mensagem {string}', (mensagem) => {
  BrowserWindowsPage.validarNovaJanelaAberta();
  BrowserWindowsPage.validarMensagem(mensagem);
});

Then('eu fecho a nova janela', () => {
  BrowserWindowsPage.fecharNovaJanela();
});
