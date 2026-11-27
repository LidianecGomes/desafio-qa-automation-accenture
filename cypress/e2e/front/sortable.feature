# language: pt
@front @sortable
Funcionalidade: Sortable
  Como usuário
  Quero reorganizar os itens da lista arrastando e soltando
  Para deixá-los na ordem que preciso

  # A lista já começa em ordem crescente no site. Para que a ordenação seja
  # de fato testada, primeiro embaralhamos a lista (ordem decrescente) via drag and drop.
  Cenário: Ordenar os elementos em ordem crescente com drag and drop
    Dado que eu acesso a página inicial do demoqa
    E escolho a opção "Interactions" na página inicial
    E clico no submenu "Sortable"
    E a lista está em ordem decrescente
    Quando eu ordeno os elementos em ordem crescente usando drag and drop
    Então os elementos devem estar em ordem crescente
