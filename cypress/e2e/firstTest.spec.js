describe('First test suite', () => {

    it('my first test', () => {
        cy.visit('/')
        cy.contains('ngx')
    })

    it('my second test', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
    })

    it.only('using parent and child to find specific selectors', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        // using get on a selector and then using .parents to navigate to a parent element in the DOM tree
        cy.get('#inputEmail3')
        .parents('form')
        .find('button') // find can only by used within parents to search for an element within the parent tree
        .should('contain', 'Sign in')
        .parents('form') // once again navigating to parent to find the checkbox under the parent of inputEmail3
        .find('nb-checkbox')
        .click()

        // can also use contains to target an element with text and then use find the type="email" within 'nb-card'
        cy.contains('nb-card', 'Horizontal form').find('[type="email"]')
    })
})