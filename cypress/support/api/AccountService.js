/**
 * Service Object da API de Account (equivalente ao Page Object, só que para API).
 * Cada método representa um endpoint e devolve a resposta para o step validar.
 */
class AccountService {
  criarUsuario(userName, password) {
    return cy.request({
      method: 'POST',
      url: '/Account/v1/User',
      body: { userName, password },
    });
  }

  gerarToken(userName, password) {
    return cy.request({
      method: 'POST',
      url: '/Account/v1/GenerateToken',
      body: { userName, password },
    });
  }

  verificarAutorizacao(userName, password) {
    return cy.request({
      method: 'POST',
      url: '/Account/v1/Authorized',
      body: { userName, password },
    });
  }

  buscarUsuario(userId, token) {
    return cy.request({
      method: 'GET',
      url: `/Account/v1/User/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  excluirUsuario(userId, token) {
    return cy.request({
      method: 'DELETE',
      url: `/Account/v1/User/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    });
  }
}

export default new AccountService();
