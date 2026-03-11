describe('メニュー一覧画面のテスト', () => {
  beforeEach(() => {
    // APIリクエストの監視とモック
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.intercept('GET', '**/api/menu', [
      { id: 1, name: 'カレー', ingredients: [], canDelete: false },
      { id: 2, name: 'サラダ', ingredients: [], canDelete: true },
    ]).as('getMenus');
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

  it('canDelete が false のメニューは削除ボタンが非表示であること', () => {
    cy.get('@getMenus')
      .its('response.body')
      .then((menus: { id: number; name: string; ingredients: []; canDelete: boolean }[]) => {

        // 少なくとも1つは canDelete が true のデータが含まれていることを確認（テストの妥当性検証）
        const hasCanDeleteTrue = menus.some((m) => m.canDelete === true);
        expect(hasCanDeleteTrue).to.equal(true);

        const hasCanDeleteFalse = menus.some((m) => m.canDelete === false);
        expect(hasCanDeleteFalse).to.equal(true);

        menus.forEach((menu) => {
          // メニュー名（またはIDなど一意の識別子）を含む行を特定
          cy.contains('tr', menu.name).within(() => {
            // 編集ボタンは常に表示されていることを確認
            cy.get('button').contains('編集').should('be.visible');

            if (menu.canDelete) {
              // canDelete が true の場合は削除ボタンが存在し、可視であること
              cy.get('button').contains('削除').should('be.visible');
            } else {
              // canDelete が false の場合は削除ボタンが存在しないこと
              cy.get('button').contains('削除').should('not.exist');
            }
          });
        });
      });
  });
});
