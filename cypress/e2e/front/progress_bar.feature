# language: pt
@front @progressbar
Funcionalidade: Progress Bar
  Como usuário
  Quero controlar a barra de progresso
  Para iniciar, parar e reiniciar o processo

  Contexto:
    Dado que eu acesso a página inicial do demoqa
    E escolho a opção "Widgets" na página inicial
    E clico no submenu "Progress Bar"

  Cenário: Parar a barra antes de 25% e resetar ao chegar em 100%
    Quando eu clico no botão Start
    E paro a barra antes de chegar a 25%
    Então o valor da barra deve ser menor ou igual a 25%
    Quando eu clico no botão Start novamente
    E a barra chega a 100%
    E eu reseto a barra de progresso
    Então a barra deve ser reiniciada

  # Bug encontrado no demoqa: se o Reset é clicado logo que a barra chega a 100%,
  # a barra volta a 0% e recomeça a subir sozinha, mesmo com o botão exibindo "Start".
  # Com o clique cerca de 500 ms depois, a barra fica em 0%. Por isso a espera e o
  # clique ficam no mesmo passo. Este cenário falha enquanto o bug existir.
  # Não roda no "npm test"; execute com "npm run test:bugs".
  @bug
  Cenário: A barra deve permanecer em 0% após o reset
    Quando eu clico no botão Start
    E eu reseto a barra assim que ela chega a 100%
    Então a barra deve permanecer em 0% após 2 segundos
