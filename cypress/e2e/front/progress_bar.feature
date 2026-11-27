# language: pt
@front @progressbar
Funcionalidade: Progress Bar
  Como usuário
  Quero controlar a barra de progresso
  Para iniciar, parar e reiniciar o processo

  Cenário: Parar a barra antes de 25% e resetar ao chegar em 100%
    Dado que eu acesso a página inicial do demoqa
    E escolho a opção "Widgets" na página inicial
    E clico no submenu "Progress Bar"
    Quando eu clico no botão Start
    E paro a barra antes de chegar a 25%
    Então o valor da barra deve ser menor ou igual a 25%
    Quando eu clico no botão Start novamente
    E a barra chega a 100%
    Então eu reseto a barra de progresso
    E o valor da barra deve ser 0%
