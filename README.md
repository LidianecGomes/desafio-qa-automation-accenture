# Desafio QA Automation – Accenture

Automação de testes de **API** e **Frontend** do site [demoqa.com](https://demoqa.com), escrita em **JavaScript** com **Cypress** e **Cucumber (BDD)**, organizada com **Page Objects** (front) e **Service Objects** (API).

## Tecnologias

| Ferramenta | Uso |
|---|---|
| [Cypress](https://www.cypress.io/) | Execução dos testes de API (`cy.request`) e de interface |
| [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) | Cucumber/BDD: cenários em Gherkin (português) |
| [@faker-js/faker](https://fakerjs.dev/) | Massa de dados aleatória |
| [cypress-real-events](https://github.com/dmtrKovalenko/cypress-real-events) | Eventos reais de mouse para o drag and drop |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- Google Chrome (opcional; o Cypress também roda no Electron, que já vem embutido)

## Instalação

```bash
git clone <url-do-repositorio>
cd desafio-qa-accenture
npm install
```

## Execução

| Comando | O que executa |
|---|---|
| `npm test` | Todos os cenários (API + Front) em uma única execução |
| `npm run test:api` | Somente a Parte 1 – API |
| `npm run test:front` | Somente a Parte 2 – Frontend |
| `npm run test:bonus` | Somente o bônus (12 registros dinâmicos no Web Tables) |
| `npm run test:chrome` | Todos os cenários no Google Chrome |
| `npm run cy:open` | Abre a interface do Cypress para executar e acompanhar visualmente |

Também é possível filtrar por qualquer tag: `npx cypress run --env tags="@forms or @sortable"`.

Ao final da execução é gerado um relatório HTML do Cucumber em `reports/cucumber-report.html`.

## Estrutura do projeto

```
cypress/
├── e2e/                          # Cenários em Gherkin (BDD)
│   ├── api/bookstore.feature
│   └── front/
│       ├── practice_form.feature
│       ├── browser_windows.feature
│       ├── web_tables.feature
│       ├── progress_bar.feature
│       └── sortable.feature
├── fixtures/
│   └── arquivo-upload.txt        # Arquivo usado no upload do Practice Form
└── support/
    ├── api/                      # Service Objects (um por grupo de endpoints)
    │   ├── AccountService.js
    │   └── BookStoreService.js
    ├── pages/                    # Page Objects (um por página)
    │   ├── HomePage.js
    │   ├── PracticeFormPage.js
    │   ├── BrowserWindowsPage.js
    │   ├── WebTablesPage.js
    │   ├── ProgressBarPage.js
    │   └── SortablePage.js
    ├── step_definitions/         # Ligação entre o Gherkin e o código
    │   ├── api/
    │   └── front/
    ├── utils/dados.js            # Geração de dados aleatórios
    ├── commands.js               # Comandos customizados do Cypress
    └── e2e.js                    # Configuração global
cypress.config.js
```

**Camadas:** o arquivo `.feature` descreve *o quê* é testado em linguagem de negócio; o *step definition* traduz cada frase em ações; o *Page/Service Object* sabe *como* interagir com a página ou com a API. Se um seletor ou endpoint mudar, a alteração fica em um único lugar.

## Cobertura do desafio

### Parte 1 – API (Book Store)
`cypress/e2e/api/bookstore.feature`, com todos os passos em uma única execução:

1. Criar usuário – `POST /Account/v1/User`
2. Gerar token – `POST /Account/v1/GenerateToken`
3. Confirmar autorização – `POST /Account/v1/Authorized`
4. Listar livros – `GET /BookStore/v1/Books`
5. Alugar 2 livros sorteados da lista – `POST /BookStore/v1/Books`
6. Validar os detalhes do usuário com os livros – `GET /Account/v1/User/{userID}`

Ao final, o usuário criado é excluído (`DELETE /Account/v1/User/{userID}`) para não deixar dados no ambiente.

### Parte 2 – Frontend

| Funcionalidade | Arquivo | Destaques |
|---|---|---|
| Practice Form | `practice_form.feature` | Dados aleatórios, upload de `.txt`, validação de todos os dados no popup |
| Browser Windows | `browser_windows.feature` | Validação da abertura da nova janela e da mensagem |
| Web Tables | `web_tables.feature` | Criar, editar e deletar; **bônus:** 12 registros dinâmicos via parâmetro do Cucumber |
| Progress Bar | `progress_bar.feature` | Parar antes de 25%, validar, ir até 100% e resetar |
| Sortable | `sortable.feature` | Drag and drop para ordem crescente |

## Decisões técnicas

- **Nova janela (Browser Windows):** o Cypress executa em uma única aba e não controla novas janelas. Seguindo a [recomendação oficial](https://docs.cypress.io/app/guides/cross-origin-testing), o teste intercepta o `window.open` com `cy.stub` para comprovar que a nova janela foi solicitada para `/sample`, abre essa URL na mesma aba para validar a mensagem e "fecha" a janela voltando à página anterior.
- **Sortable:** a lista já começa em ordem crescente. Para que a ordenação seja realmente testada, o cenário primeiro coloca os itens em ordem decrescente e depois os ordena de forma crescente, sempre via drag and drop.
- **Progress Bar:** o teste aguarda a barra passar da metade do limite (12%) antes de clicar em Stop, garantindo margem de tempo para parar antes de 25%.
- **Web Tables:** os registros são localizados pela caixa de busca, então o teste não depende da paginação da tabela (10 linhas por página), o que é essencial no bônus com 12 registros.
- **Anúncios do demoqa:** domínios de anúncio são bloqueados em `cypress.config.js` e banners fixos são removidos, evitando lentidão e cliques interceptados.
