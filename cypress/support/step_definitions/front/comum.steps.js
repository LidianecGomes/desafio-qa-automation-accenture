import { Given } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../../pages/HomePage';

// Steps de navegação reutilizados por todas as funcionalidades de front.
Given('que eu acesso a página inicial do demoqa', () => {
  HomePage.acessar();
});

Given('escolho a opção {string} na página inicial', (card) => {
  HomePage.escolherCard(card);
});

Given('clico no submenu {string}', (submenu) => {
  HomePage.clicarSubmenu(submenu);
});
