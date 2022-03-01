describe('Sign up', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081')
    cy.sendriaDeleteAllMessages();
  })

  it('should register a new user', () => {

    const userName = cy.faker.name.findName();
    const email = cy.faker.internet.email();

    cy.get('a[href*=register]').click();
    cy.get('button').should('have.text', 'Sign Up');
    cy.get('input[name=username]').type(userName);
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type('P@ssword');
    cy.get('button.btn-primary').click();
    cy.get('div.alert-success').should('have.text', 'User was registered successfully! Please check your email');
    
    cy.sendriaGetMessageByEmailAddressAndSubject(email, 'Please confirm your account').then((message) => {
      consol.log(email);
      
      cy.sendriaGetMessageHtmlById(message.id).then((html) => {
        const link = html.match(/(?<=href=")(.*)(?=" target)/g)[0];
        cy.visit(link);
        cy.get("strong").should("have.text", "Account confirmed!");
      });
    });
  })

})
