import { Given, When, Then, Before, After } from '@badeball/cypress-cucumber-preprocessor';
import AccountService from '../../api/AccountService';
import BookStoreService from '../../api/BookStoreService';
import { gerarCredenciais } from '../../utils/dados';

// Contexto compartilhado entre os steps de um mesmo cenário.
let ctx;

Before({ tags: '@api' }, () => {
  ctx = {};
});

Given('que eu crio um novo usuário', () => {
  ctx.credenciais = gerarCredenciais();
  const { userName, password } = ctx.credenciais;

  AccountService.criarUsuario(userName, password).then((res) => {
    expect(res.status).to.eq(201);
    expect(res.body.username).to.eq(userName);
    expect(res.body.userID).to.be.a('string').and.not.be.empty;
    expect(res.body.books).to.be.an('array').that.is.empty;
    ctx.userId = res.body.userID;
  });
});

When('eu gero um token de acesso para esse usuário', () => {
  const { userName, password } = ctx.credenciais;

  AccountService.gerarToken(userName, password).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body.status).to.eq('Success');
    expect(res.body.token).to.be.a('string').and.not.be.empty;
    ctx.token = res.body.token;
  });
});

Then('o usuário deve estar autorizado', () => {
  const { userName, password } = ctx.credenciais;

  AccountService.verificarAutorizacao(userName, password).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body).to.eq(true);
  });
});

When('eu listo os livros disponíveis', () => {
  BookStoreService.listarLivros().then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body.books).to.be.an('array').and.have.length.greaterThan(1);
    ctx.livrosDisponiveis = res.body.books;
  });
});

When('eu alugo {int} livros de livre escolha', (quantidade) => {
  // "Livre escolha": sorteia livros diferentes da lista retornada pela API.
  const sorteados = Cypress._.sampleSize(ctx.livrosDisponiveis, quantidade);
  ctx.livrosAlugados = sorteados;
  const isbns = sorteados.map((livro) => livro.isbn);
  cy.log(`Livros escolhidos: ${sorteados.map((l) => l.title).join(' | ')}`);

  BookStoreService.alugarLivros(ctx.userId, isbns, ctx.token).then((res) => {
    expect(res.status).to.eq(201);
    expect(res.body.books.map((b) => b.isbn)).to.have.members(isbns);
  });
});

Then('os detalhes do usuário devem exibir os livros alugados', () => {
  AccountService.buscarUsuario(ctx.userId, ctx.token).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body.userId).to.eq(ctx.userId);
    expect(res.body.username).to.eq(ctx.credenciais.userName);
    expect(res.body.books).to.have.length(ctx.livrosAlugados.length);

    const isbnsDoUsuario = res.body.books.map((b) => b.isbn);
    const titulosDoUsuario = res.body.books.map((b) => b.title);
    expect(isbnsDoUsuario).to.have.members(ctx.livrosAlugados.map((l) => l.isbn));
    expect(titulosDoUsuario).to.have.members(ctx.livrosAlugados.map((l) => l.title));
  });
});

// Limpeza: remove o usuário criado para não deixar lixo no ambiente.
After({ tags: '@api' }, () => {
  if (ctx && ctx.userId && ctx.token) {
    AccountService.excluirUsuario(ctx.userId, ctx.token);
  }
});
