# language: pt
@api
Funcionalidade: Aluguel de livros na Book Store (API)
  Como um novo usuário da Book Store
  Quero criar minha conta e me autenticar
  Para conseguir alugar livros disponíveis no sistema

  Cenário: Criar usuário, autorizar e alugar dois livros
    Dado que eu crio um novo usuário
    Quando eu gero um token de acesso para esse usuário
    Então o usuário deve estar autorizado
    Quando eu listo os livros disponíveis
    E eu alugo 2 livros de livre escolha
    Então os detalhes do usuário devem exibir os livros alugados
