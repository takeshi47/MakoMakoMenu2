describe('メニュー一覧画面のテスト', () => {
  beforeEach(() => {
    // APIリクエストの監視とモック
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.intercept('GET', '**/api/menu').as('getMenus');

    cy.intercept('GET', '**/api/menu/csrf-token/menu_delete', { token: 'mock-token' }).as(
      'getCsrfToken',
    );

    // ログイン処理
    cy.visit('/login');
    cy.get('input[formControlName="email"]').clear().type('admin@example.com');
    cy.get('input[formControlName="password"]').clear().type('password');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // メニュー一覧へ遷移
    cy.visit('/menu/list');
    cy.wait('@getMenus');
  });

  it('メニュー一覧が表示されること', () => {
    cy.get('tbody tr').should('have.length.at.least', 1);
    cy.get('button').contains('編集').should('be.visible');
  });
});
