/**
 * Service Object da API da Book Store.
 */
class BookStoreService {
  listarLivros() {
    return cy.request({
      method: 'GET',
      url: '/BookStore/v1/Books',
    });
  }

  alugarLivros(userId, isbns, token) {
    return cy.request({
      method: 'POST',
      url: '/BookStore/v1/Books',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
      },
    });
  }
}

export default new BookStoreService();
