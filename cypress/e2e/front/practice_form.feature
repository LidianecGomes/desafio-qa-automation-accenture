# language: pt
@front @forms
Funcionalidade: Practice Form
  Como estudante
  Quero preencher o formulário de cadastro
  Para enviar meus dados ao sistema

  Contexto:
    Dado que eu acesso a página inicial do demoqa
    E escolho a opção "Forms" na página inicial
    E clico no submenu "Practice Form"

  Cenário: Preencher e submeter o formulário com dados aleatórios
    Quando eu preencho todo o formulário com valores aleatórios
    E submeto o formulário
    Então um popup de confirmação deve ser aberto com os dados enviados
    E eu fecho o popup

  # Bug encontrado no demoqa: ao clicar em Close, o site lança
  # "TypeError: findDOMNode is not a function" e o popup continua aberto.
  # Este cenário falha enquanto o bug existir.
  # Não roda no "npm test"; execute com "npm run test:bugs".
  @bug
  Cenário: O popup deve fechar ao clicar em Close
    Quando eu preencho todo o formulário com valores aleatórios
    E submeto o formulário
    E eu fecho o popup
    Então o popup não deve mais ser exibido
