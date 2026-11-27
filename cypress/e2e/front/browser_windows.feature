# language: pt
@front @windows
Funcionalidade: Browser Windows
  Como usuário
  Quero abrir uma nova janela a partir da página
  Para visualizar o conteúdo de exemplo

  Cenário: Abrir uma nova janela e validar a mensagem
    Dado que eu acesso a página inicial do demoqa
    E escolho a opção "Alerts, Frame & Windows" na página inicial
    E clico no submenu "Browser Windows"
    Quando eu clico no botão New Window
    Então uma nova janela deve ser aberta com a mensagem "This is a sample page"
    E eu fecho a nova janela
