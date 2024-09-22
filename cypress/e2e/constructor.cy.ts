describe('интеграционные тесты для страницы конструктора бургера', () => {
  const testUrl = 'http://localhost:4000';
  const bun = '[data-cy="1"]';
  const anotherBun = '[data-cy="8"]';
  const main = '[data-cy="7"]';
  const sauce = '[data-cy="4"]';
  const constructorBurgerConstructor = '[data-cy="burgerConstructor"]';
  const modal = '[data-cy="modal"]';
  const modalClose = '[data-cy="modalClose"]';
  const modalCloseOverlay = '[data-cy="modalCloseOverlay"]';
  const submitOrderButton = '[data-cy="order-button"]';

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' }).as(
      'login'
    );
    cy.intercept('POST', 'api/auth/token', { fixture: 'login.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Подставляем моковые токены
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('fakeRefreshToken')
    );
    cy.setCookie('fakeAccessToken', 'fakeAccessToken');
    cy.visit(testUrl);
    cy.viewport(1680, 1024);
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очистили хранилища после выполнения теста
    window.localStorage.clear();
    cy.clearCookies();
  });

  const verifyBunIngredients = (
    topBun: string,
    middleMain: string,
    bottomBun: string
  ) => {
    cy.get(constructorBurgerConstructor).should('contain', topBun);
    cy.get(constructorBurgerConstructor).should('contain', middleMain);
    cy.get(constructorBurgerConstructor).should('contain', bottomBun);
  };

  describe('добавление ингредиента в конструктор', () => {
    it('тест на корректную работу счетчика', () => {
      cy.get(main).children('button').click();
      cy.get(main).find('.counter__num').contains('1');
    });
  });

  describe('добавление булочек и начинок', () => {
    it('тест на добавление булочек и начинок', () => {
      cy.get(bun).children('button').click();
      cy.get(main).children('button').click();
      verifyBunIngredients(
        'Краторная булка N-200i',
        'Говяжий метеорит (отбивная)',
        'Краторная булка N-200i'
      );
    });
  });

  it('тест на добавление булочек, начинок и соуса', () => {
    cy.get(bun).children('button').click();
    cy.get(main).children('button').click();
    cy.get(sauce).children('button').click();
    cy.get(constructorBurgerConstructor).should('contain', 'Соус Spicy-X');
    verifyBunIngredients(
      'Краторная булка N-200i',
      'Говяжий метеорит (отбивная)',
      'Краторная булка N-200i'
    );
  });

  it('тест на добавление булочек, но после добавления начинок', () => {
    cy.get(main).children('button').click();
    cy.get(bun).children('button').click();
    verifyBunIngredients(
      'Краторная булка N-200i',
      'Говяжий метеорит (отбивная)',
      'Краторная булка N-200i'
    );
  });

  describe('замена булочек', () => {
    it('тест на корректную замену булки (другой булкой) без начинок', () => {
      cy.get(bun).children('button').click();
      verifyBunIngredients(
        'Краторная булка N-200i',
        '',
        'Краторная булка N-200i'
      );
      cy.get(anotherBun).children('button').click();
      verifyBunIngredients(
        'Флюоресцентная булка R2-D3',
        '',
        'Флюоресцентная булка R2-D3'
      );
    });
  });

  it('тест на корректную замену булки (другой булкой) с начинками', () => {
    cy.get(bun).children('button').click();
    verifyBunIngredients(
      'Краторная булка N-200i',
      '',
      'Краторная булка N-200i'
    );
    cy.get(main).children('button').click();
    cy.get(anotherBun).children('button').click();
    verifyBunIngredients(
      'Флюоресцентная булка R2-D3',
      'Говяжий метеорит (отбивная)',
      'Флюоресцентная булка R2-D3'
    );
  });

  describe('модальные окна', () => {
    it('тест на корректное открытие модального окна', () => {
      // Проверка, что модальное окно открылось
      cy.contains('Биокотлета из марсианской Магнолии').click();
      cy.get(modal).should('be.visible');
    });

    it('тест на корректное закрытие модального окна по Х', () => {
      cy.get(main).click();
      cy.get(modal).should('be.visible');
      cy.get(modalClose).click();
      cy.get(modal).should('not.exist');
    });

    it('тест на корректное закрытие модального окна по клику на оверлей', () => {
      cy.get(anotherBun).click();
      cy.get(modal).should('be.visible');
      cy.get(modalCloseOverlay).click({ force: true });
      cy.get(modal).should('not.exist');
    });
  });

  describe('создание заказа', () => {
    it('тест на создание заказа и проверку пустого конструктора после закрытия модального окна', () => {
      cy.get(bun).children('button').click();
      cy.get(main).children('button').click();
      verifyBunIngredients(
        'Краторная булка N-200i',
        'Говяжий метеорит (отбивная)',
        'Краторная булка N-200i'
      );
      cy.get(submitOrderButton).click();
      cy.get(modal).should('be.visible');
      cy.get(modalClose).click();
      cy.get(modal).should('not.exist');

      cy.get(constructorBurgerConstructor).should('exist');
      cy.get(constructorBurgerConstructor).should(
        'not.contain',
        'Краторная булка N-200i'
      );
      cy.get(constructorBurgerConstructor).should(
        'not.contain',
        'Говяжий метеорит (отбивная)'
      );
    });
  });
});
