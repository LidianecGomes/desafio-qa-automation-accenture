# language: pt
@front @webtables
Funcionalidade: Web Tables
  Como usuário
  Quero gerenciar registros na tabela
  Para manter os dados de funcionários atualizados

  Contexto:
    Dado que eu acesso a página inicial do demoqa
    E escolho a opção "Elements" na página inicial
    E clico no submenu "Web Tables"

  Cenário: Criar, editar e deletar um registro
    Quando eu crio um novo registro
    Então o novo registro deve ser exibido na tabela
    Quando eu edito o registro criado
    Então o registro deve ser exibido com os dados atualizados
    Quando eu deleto o registro criado
    Então o registro não deve mais ser exibido na tabela

  @bonus
  Cenário: Criar e deletar 12 registros de forma dinâmica
    Quando eu crio 12 novos registros
    Então os 12 registros devem ser exibidos na tabela
    Quando eu deleto todos os registros criados
    Então nenhum dos registros criados deve ser exibido na tabela

  # Bug encontrado no demoqa: ao excluir um registro criado, todos os outros
  # registros criados também são apagados. Este cenário falha enquanto o bug existir.
  # Não roda no "npm test"; execute com "npm run test:bugs".
  @bug
  Cenário: Excluir um registro deve remover apenas ele
    Quando eu crio 2 novos registros
    E eu deleto o primeiro registro criado
    Então os demais registros criados devem continuar na tabela
