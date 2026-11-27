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
 * Arrasta um elemento até outro (drag and drop).
 *
 * Bibliotecas de drag and drop funcionam de dois jeitos:
 *  - HTML5 nativo (o item fica com draggable="true"): escutam dragstart/dragover/drop;
 *  - Mouse/pointer: escutam mousedown/mousemove/mouseup (ou pointer*).
 * O comando começa com o "clique e segura" e verifica qual dos dois o site usa.
 */
Cypress.Commands.add('arrastarPara', { prevSubject: 'element' }, (origem, destinoSelector, indiceDestino = 0) => {
  cy.get(destinoSelector).eq(indiceDestino).then(($destino) => {
    const ro = origem[0].getBoundingClientRect();
    const rd = $destino[0].getBoundingClientRect();
    const win = origem[0].ownerDocument.defaultView;
    const ponto = (x, y) => ({
      clientX: x, clientY: y, pageX: x + win.scrollX, pageY: y + win.scrollY,
    });
    const inicio = ponto(ro.left + ro.width / 2, ro.top + ro.height / 2);
    const meio = ponto(ro.left + ro.width / 2, ro.top + ro.height / 2 - 10);
    // Solta perto do topo do destino, para o item entrar ANTES dele.
    const fim = ponto(rd.left + rd.width / 2, rd.top + 3);
    const botao = { button: 0, buttons: 1, which: 1, force: true };
    const pointer = { ...botao, pointerId: 1, isPrimary: true, eventConstructor: 'PointerEvent' };

    cy.wrap(origem)
      .trigger('pointerdown', { ...pointer, ...inicio })
      .trigger('mousedown', { ...botao, ...inicio });
    cy.wait(100);

    cy.wrap(origem).then(($origem) => {
      if ($origem.attr('draggable') === 'true') {
        // Drag and drop HTML5 nativo
        const dataTransfer = new DataTransfer();
        cy.wrap($origem).trigger('dragstart', { dataTransfer, ...inicio, force: true });
        cy.wait(100);
        cy.wrap($destino)
          .trigger('dragenter', { dataTransfer, ...fim, force: true })
          .trigger('dragover', { dataTransfer, ...fim, force: true });
        cy.wait(100);
        cy.wrap($destino).trigger('drop', { dataTransfer, ...fim, force: true });
        cy.wrap($origem).trigger('dragend', { dataTransfer, ...fim, force: true });
      } else {
        // Drag and drop por eventos de mouse/pointer
        cy.wrap($origem)
          .trigger('pointermove', { ...pointer, ...meio })
          .trigger('mousemove', { ...botao, ...meio });
        cy.wrap($destino)
          .trigger('pointermove', { ...pointer, ...fim })
          .trigger('mousemove', { ...botao, ...fim });
        cy.wait(100);
        cy.wrap($destino)
          .trigger('pointerup', { ...pointer, ...fim, buttons: 0 })
          .trigger('mouseup', { ...botao, ...fim, buttons: 0 });
      }
    });
    cy.wait(200);
  });
});
