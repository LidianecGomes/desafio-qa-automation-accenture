# Desafio QA Automation – Accenture

Automação de testes de **API** e **Frontend** do site [demoqa.com](https://demoqa.com), escrita em **JavaScript** com **Cypress** e **Cucumber (BDD)**, organizada com **Page Objects** (front) e **Service Objects** (API).

## Tecnologias

| Ferramenta | Uso |
|---|---|
| [Cypress](https://www.cypress.io/) | Execução dos testes de API (`cy.request`) e de interface |
| [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) | Cucumber/BDD: cenários em Gherkin (português) |
| [@faker-js/faker](https://fakerjs.dev/) | Massa de dados aleatória |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 22 ou superior (exigido pelo Cypress 16)
- Google Chrome (opcional; o Cypress também roda no Electron, que já vem embutido)

## Instalação

```bash
git clone https://github.com/LidianecGomes/desafio-qa-automation-accenture.git
cd desafio-qa-automation-accenture
npm install
```

## Execução

| Comando | O que executa |
|---|---|
| `npm test` | Todos os cenários (API + Front) em uma única execução, exceto os de bugs conhecidos (`@bug`) |
| `npm run test:api` | Somente a Parte 1 – API |
| `npm run test:front` | Somente a Parte 2 – Frontend |
| `npm run test:bonus` | Somente o bônus (12 registros dinâmicos no Web Tables) |
| `npm run test:bugs` | Somente os cenários que reproduzem bugs encontrados no demoqa (falham enquanto o bug existir) |
| `npm run test:chrome` | Todos os cenários no Google Chrome |
| `npm run cy:open` | Abre a interface do Cypress para executar e acompanhar visualmente |

Também é possível filtrar por qualquer tag: `npx cypress run --expose tags="@forms or @sortable"`.

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
| Progress Bar | `progress_bar.feature` | Parar antes de 25%, validar, ir até 100% e resetar (botão volta a "Start") |
| Sortable | `sortable.feature` | Drag and drop para ordem crescente |

## Bugs encontrados

### 1. Web Tables: excluir um registro apaga todos os registros criados

**Passos para reproduzir:**
1. Acessar https://demoqa.com/webtables
2. Adicionar dois novos registros pelo botão **Add**
3. Excluir apenas o primeiro registro criado (ícone da lixeira)

**Resultado esperado:** somente o registro excluído sai da tabela.
**Resultado obtido:** todos os registros criados são removidos; restam apenas os 3 registros originais.

**Evidência na automação:** com 15 registros na tabela (3 originais + 12 criados), a exclusão de um único registro deixou 3 linhas (`expected 3 to equal 14`).

**Como a automação trata:** o cenário bônus exclui cada registro que ainda estiver na tabela e registra no log quando ele já havia sido removido. O cenário `@bug` em `web_tables.feature` reproduz o defeito e falha enquanto ele existir (`npm run test:bugs`).

### 2. Practice Form: o popup de confirmação não fecha ao clicar em Close

**Passos para reproduzir:**
1. Acessar https://demoqa.com/automation-practice-form
2. Preencher os campos obrigatórios e clicar em **Submit**
3. No popup "Thanks for submitting the form", clicar em **Close**

**Resultado esperado:** o popup é fechado e o formulário volta a ser exibido.
**Resultado obtido:** o popup continua aberto e o site lança no console o erro `TypeError: findDOMNode is not a function`.

**Como a automação trata:** o cenário principal de `practice_form.feature` valida os dados no popup e clica em Close, mas não verifica se ele sumiu. O cenário `@bug` reproduz o defeito, verificando que o popup deixa de ser exibido, e falha enquanto ele existir (`npm run test:bugs`).

### 3. Progress Bar: Reset logo após chegar a 100% faz a barra voltar a subir sozinha

**Passos para reproduzir:**
1. Acessar https://demoqa.com/progress-bar
2. Clicar em **Start** e aguardar a barra chegar a 100%
3. Clicar em **Reset** imediatamente e observar a barra por alguns segundos

**Resultado esperado:** a barra volta a 0% e permanece parada, com o botão **Start** disponível.
**Resultado obtido:** a barra volta a 0% e recomeça a subir (cerca de 1% a cada 100 ms), embora o botão exiba **Start**. Quando o Reset é clicado cerca de 500 ms depois de chegar a 100%, a barra fica em 0%, o que indica que o timer do site continua ativo por um instante depois dos 100%.

**Evidência na automação:** com o clique imediato, a barra estava entre 20% e 24% dois segundos após o Reset, em todas as tentativas (`expected '21' to equal '0'`). Com o clique 500 ms depois, ficou em 0% em todas. Antes de o bug ser identificado, o cenário principal passava ou falhava conforme o tempo entre a barra chegar a 100% e o clique em Reset.

**Como a automação trata:** o cenário principal de `progress_bar.feature` confirma que o Reset foi aplicado (o botão volta a "Start" e a barra sai dos 100%), sem depender do valor exato. O cenário `@bug` clica em Reset assim que a barra chega a 100%, verifica que ela permanece em 0% e falha enquanto o bug existir (`npm run test:bugs`).

> Se o demoqa corrigir algum desses bugs, o cenário `@bug` correspondente passa a ser aprovado. Nesse caso, basta remover a tag `@bug` para que ele volte ao `npm test`.

## Decisões técnicas

- **Nova janela (Browser Windows):** o Cypress executa em uma única aba e não controla novas janelas. Seguindo a [recomendação oficial](https://docs.cypress.io/app/guides/cross-origin-testing), o teste intercepta o `window.open` com `cy.stub` para comprovar que a nova janela foi solicitada para `/sample`, abre essa URL na mesma aba para validar a mensagem e "fecha" a janela voltando à página anterior.
- **Sortable:** a lista já começa em ordem crescente. Para que a ordenação seja realmente testada, o cenário primeiro coloca os itens em ordem decrescente e depois os ordena de forma crescente, sempre via drag and drop.
- **Progress Bar:** o teste aguarda a barra passar da metade do limite (12%) antes de clicar em Stop, garantindo margem de tempo para parar antes de 25%.
- **Web Tables:** os registros são localizados pela caixa de busca, então o teste não depende da paginação da tabela (10 linhas por página), o que é essencial no bônus com 12 registros.
- **Anúncios do demoqa:** domínios de anúncio são bloqueados em `cypress.config.js` e banners fixos são removidos, evitando lentidão e cliques interceptados.
- **Exceções do site:** `cypress/support/e2e.js` ignora apenas exceções conhecidas e documentadas (hoje, o `findDOMNode` do bug 2). Qualquer outra exceção do site faz o teste falhar, para não esconder defeitos.
- **Web Tables (validação):** cada valor do registro é conferido na sua própria coluna, localizada pelo título, evitando falsos positivos (por exemplo, a idade "20" dentro do salário "20500").
