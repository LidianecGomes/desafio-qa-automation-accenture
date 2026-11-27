# language: pt
@front @forms
Funcionalidade: Practice Form
  Como estudante
  Quero preencher o formulário de cadastro
  Para enviar meus dados ao sistema

  Cenário: Preencher e submeter o formulário com dados aleatórios
    Dado que eu acesso a página inicial do demoqa
    E escolho a opção "Forms" na página inicial
    E clico no submenu "Practice Form"
    Quando eu preencho todo o formulário com valores aleatórios
    E submeto o formulário
    Então um popup de confirmação deve ser aberto com os dados enviados
    Quando eu fecho o popup
    Então o popup não deve mais ser exibido
