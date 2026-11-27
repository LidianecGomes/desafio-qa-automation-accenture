import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PracticeFormPage from '../../pages/PracticeFormPage';
import { gerarAluno } from '../../utils/dados';

let aluno;

When('eu preencho todo o formulário com valores aleatórios', () => {
  aluno = gerarAluno();
  PracticeFormPage.validarPagina();
  PracticeFormPage.preencherFormulario(aluno);
});

When('submeto o formulário', () => {
  PracticeFormPage.submeter();
});

Then('um popup de confirmação deve ser aberto com os dados enviados', () => {
  PracticeFormPage.validarPopupAberto();
  PracticeFormPage.validarDadosNoPopup(aluno);
});

When('eu fecho o popup', () => {
  PracticeFormPage.fecharPopup();
});

Then('o popup não deve mais ser exibido', () => {
  PracticeFormPage.validarPopupFechado();
});
