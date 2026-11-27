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

### Executar tudo de uma vez

| Comando | O que executa |
|---|---|
| `npm test` | Todos os cenários (API + Front) em segundo plano (headless), mostrando a tabela de resultados no final. **Forma recomendada para avaliar a entrega.** |
| `npx cypress run --headed --browser chrome` | Todos os cenários em sequência, abrindo o Chrome para acompanhar visualmente cada teste |

Nas duas opções, os cenários com a tag `@bug` ficam de fora automaticamente (configurado em `cypress.config.js`, em `expose.tags`).

### Executar por parte

| Comando | Equivale a | O que executa |
|---|---|---|
| `npm run test:api` | `cypress run --expose tags=@api` | Somente a Parte 1 – API |
| `npm run test:front` | `cypress run --expose tags="@front and not @bug"` | Somente a Parte 2 – Frontend, sem os cenários `@bug` |
| `npm run test:bonus` | `cypress run --expose tags=@bonus` | Somente o bônus (12 registros dinâmicos no Web Tables) |
| `npm run test:bugs` | `cypress run --expose tags=@bug` | Somente os cenários que reproduzem bugs encontrados no demoqa (falham enquanto o bug existir) |
| `npm run test:chrome` | `cypress run --browser chrome` | Todos os cenários no Google Chrome, em segundo plano (headless), sem os cenários `@bug` |

### Executar um arquivo específico

```bash
npx cypress run --spec cypress/e2e/front/web_tables.feature
```

Os cenários `@bug` do arquivo também ficam de fora.

### Modo interativo

```bash
npm run cy:open
```

Abre a interface do Cypress. Nela, cada arquivo `.feature` é executado individualmente: clique em **E2E Testing**, escolha o navegador e clique no arquivo desejado. Para rodar todos de uma vez, use uma das opções de [Executar tudo de uma vez](#executar-tudo-de-uma-vez).

### Filtrar por tag

```bash
npx cypress run --expose tags="(@forms or @sortable) and not @bug"
```

Use `--expose`, e não `--env`: no Cypress 16 o cucumber-preprocessor ignora as tags passadas por `--env`. Uma tag informada na linha de comando **substitui** o padrão do `cypress.config.js`; por isso, inclua `and not @bug` para deixar de fora os cenários de bugs conhecidos.

| Tag | Onde está |
|---|---|
| `@api` | `bookstore.feature` (Parte 1 – API) |
| `@front` | Todos os arquivos da Parte 2 – Frontend |
| `@forms` | `practice_form.feature` |
| `@windows` | `browser_windows.feature` |
| `@webtables` | `web_tables.feature` |
| `@progressbar` | `progress_bar.feature` |
| `@sortable` | `sortable.feature` |
| `@bonus` | Cenário bônus de 12 registros em `web_tables.feature` |
| `@bug` | Cenários que reproduzem bugs do demoqa em `practice_form.feature`, `web_tables.feature` e `progress_bar.feature` |

Ao final da execução é gerado um relatório HTML do Cucumber em `reports/cucumber-report.html`.

## Evidências de execução

Execução completa realizada em **27/11/2026**, no commit `8178197`.

| Ambiente | Versão |
|---|---|
| Sistema operacional | Windows 11 Home Single Language (10.0.26300) |
| Cypress | 16.4.0 |
| Navegador | Electron 150 (headless, padrão do `cypress run`) |
| Node.js | 20.18.0 |

### `npm test`: todos os cenários (exceto `@bug`)

```
       Spec                                              Tests  Passing  Failing  Pending  Skipped
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ √  api/bookstore.feature                    00:06        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  front/browser_windows.feature            00:07        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  front/practice_form.feature              00:07        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  front/progress_bar.feature               00:14        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  front/sortable.feature                   00:12        1        1        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  front/web_tables.feature                 00:42        2        2        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    √  All specs passed!                        01:31        7        7        -        -        -
```

Relatório completo do Cucumber: [`docs/evidencias/relatorio-npm-test.html`](docs/evidencias/relatorio-npm-test.html).

### `npm run test:bugs`: cenários que reproduzem bugs do demoqa

Os 3 cenários falham, como esperado, enquanto os bugs existirem no site:

| Cenário | Motivo da falha | Evidência |
|---|---|---|
| Web Tables: excluir um registro deve remover apenas ele | O segundo registro criado foi apagado junto com o primeiro | [bug1-web-tables.png](docs/evidencias/screenshots-bugs/bug1-web-tables.png) |
| Practice Form: o popup deve fechar ao clicar em Close | `TypeError: findDOMNode is not a function`; o popup continua aberto | [bug2-practice-form.png](docs/evidencias/screenshots-bugs/bug2-practice-form.png) |
| Progress Bar: a barra deve permanecer em 0% após o reset | 2 segundos após o Reset, a barra estava em 24% (`expected '24' to equal '0'`) | [bug3-progress-bar.png](docs/evidencias/screenshots-bugs/bug3-progress-bar.png) |

Relatório completo do Cucumber: [`docs/evidencias/relatorio-test-bugs.html`](docs/evidencias/relatorio-test-bugs.html).

> Os relatórios HTML não são exibidos diretamente pelo GitHub: após clonar o repositório, abra os arquivos no navegador.

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
docs/
└── evidencias/                   # Evidências de execução (ver seção acima)
    ├── relatorio-npm-test.html   # Relatório do Cucumber da execução completa
    ├── relatorio-test-bugs.html  # Relatório dos cenários @bug
    └── screenshots-bugs/         # Um screenshot por bug encontrado
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
- **Web Tables:** para validar se um registro existe, o teste usa a caixa de busca, então não depende da paginação da tabela (10 linhas por página), o que é essencial no bônus com 12 registros. Já a edição e a exclusão são feitas **sem** a busca ativa: o teste limpa a busca e seleciona a maior opção de linhas por página, para que todos os registros fiquem visíveis. Isso porque, no demoqa, excluir um registro com a busca filtrada apaga também registros que não aparecem no filtro (ver [bug 1](#1-web-tables-excluir-um-registro-apaga-todos-os-registros-criados)).
- **Anúncios do demoqa:** domínios de anúncio são bloqueados em `cypress.config.js` e banners fixos são removidos, evitando lentidão e cliques interceptados.
- **Exceções do site:** `cypress/support/e2e.js` ignora apenas exceções conhecidas e documentadas (hoje, o `findDOMNode` do bug 2). Qualquer outra exceção do site faz o teste falhar, para não esconder defeitos.
- **Web Tables (validação):** cada valor do registro é conferido na sua própria coluna, localizada pelo título, evitando falsos positivos (por exemplo, a idade "20" dentro do salário "20500").
