import 'cypress-real-events';
import './commands';

// Os scripts de anúncio do demoqa lançam erros de JavaScript que não têm
// relação com o que estamos testando. Sem isso, o Cypress falharia o teste.
Cypress.on('uncaught:exception', () => false);
