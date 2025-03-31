describe('Inactivate User', () => {

   beforeEach(() => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('laresencantoadmin@gmail.com');
      cy.get('input[name="password"]').type('Admin1576@');
      cy.contains('button', 'Entrar').click();
      cy.wait(1000);
      cy.visit('/admin/users');
  });

   it('Should activate a user', () => {
      cy.get('[data-cy="user-submenu-button-Josivaldo"]').click();

      expect(
         cy.get('[data-cy="user-submenu-inactivate"]')
            .should('be.visible')
            .should('have.text', 'Ativar')
      );

      cy.get('[data-cy="user-submenu-inactivate"]').click();
      cy.wait(1000);

      cy.get('.MuiGrid2-grid-xs-3 > .MuiButtonBase-root').click();

      cy.get('input[name="email"]').type('matheus@gmail.com');
      cy.get('input[name="password"]').type('Mat15777@');
      cy.contains('button', 'Entrar').click();

      expect(
         cy.get('div[role="alert"]').contains('Login efetuado com sucesso!')
            .should('be.visible')
      );

   });

   it('Should inactivate a user', () => {
      cy.get('[data-cy="user-submenu-button-Josivaldo"]').click();

      expect(
         cy.get('[data-cy="user-submenu-inactivate"]')
            .should('be.visible')
            .should('have.text', 'Inativar')
      );

      cy.get('[data-cy="user-submenu-inactivate"]').click();
      cy.wait(1000);


      cy.get('.MuiGrid2-grid-xs-3 > .MuiButtonBase-root').click();
      cy.get('input[name="email"]').type('matheus@gmail.com');
      cy.get('input[name="password"]').type('Mat15777@');
      cy.contains('button', 'Entrar').click();

      expect(
         cy.get('.Toastify__toast-body > :nth-child(2)')
            .should('be.visible')
            .should('have.text', 'Usuário está inativado! Consulte o administrador do sistema.')
      );

   });
});