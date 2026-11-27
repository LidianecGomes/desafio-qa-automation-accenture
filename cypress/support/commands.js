/**
 * Remove banners e o rodapé fixo que podem ficar por cima dos botões.
 */
Cypress.Commands.add('removerAnuncios', () => {
  cy.document().then((doc) => {
    doc
      .querySelectorAll('#fixedban, #adplus-anchor, footer, iframe[id^="google_ads"]')
      .forEach((el) => el.remove());
  });
});

/**
 * Arrasta um elemento até outro usando eventos reais de mouse (Chrome DevTools Protocol).
 * Eventos "reais" são necessários porque bibliotecas de drag and drop ignoram
 * eventos sintéticos disparados com cy.trigger em muitos casos.
 */
Cypress.Commands.add('arrastarPara', { prevSubject: 'element' }, (origem, destinoSelector, indiceDestino = 0) => {
  const destino = () => cy.get(destinoSelector).eq(indiceDestino);

  cy.wrap(origem).realMouseDown({ position: 'center' });
  // Pequeno movimento inicial para a biblioteca reconhecer o início do arraste.
  cy.wrap(origem).realMouseMove(0, -10, { position: 'center' });
  // Movimento em duas etapas até o topo do destino (o item é solto acima do destino).
  destino().realMouseMove(0, 10, { position: 'top' });
  destino().realMouseMove(0, 5, { position: 'top' });
  destino().realMouseUp({ position: 'top' });
});
