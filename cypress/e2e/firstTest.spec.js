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

    it('using parent and child to find specific selectors', () => {
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

describe.only('Saving subject of the command', () => {
    it('then and wrap methods', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // when using ".find" on a cy chain like below the find acts as a cypress chainable

        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should('contain', 'Email address')
        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain', 'Password')
        // cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        // cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')

        // in selenium and puppeteer we could do the above action by using the below format:
        // but this will not work as Cypress is asynchronous and we cannot save the context of the cy commands to reuse later on
        // to use this format we will need to use the "then" syntax

        // const firstForm = cy.contains('nb-card', 'Basic form');
        // const secondForm = cy.contains('nb-card', 'Using the Grid');
        // firstForm.find('[for="exampleInputEmail1"]').should('contain', 'Email address');
        // firstForm.find('[for="exampleInputPassword1"]').should('contain', 'Password');
        // secondForm.find('[for="inputEmail1"]').should('contain', 'Email');
        // secondForm.find('[for="inputPassword2"]').should('contain', 'Password');


        // now using the "then" format to do the same 
        cy.contains('nb-card', 'Basic form').then( firstForm => {
            // when using "then" then parameter to the "then" function becomes a jquery objects
            // in this case "firstForm" is the jquery object
            // Also another important thing to note below is the "find" will now be working on a jquery object as opposed to earlier 
            // where it was being chained off of a cypress object
            // when being changed off of a jquery element we can only use jquery methods instead of cypress methods as above
            const emailText = firstForm.find('[for="exampleInputEmail1"]').text();
            const passwordText = firstForm.find('[for="exampleInputPassword1"]').text();
            expect(emailText).to.eq('Email address');
            expect(passwordText).to.eq('Password');

            cy.contains('nb-card', 'Using the Grid').then( secondForm => {
                const passwordTextTwo = secondForm.find('[for="inputPassword2"]').text();
                //since this cy.contains block is within the first "then" block we still have access to the variables defined
                // outside of the second "then" block. If suppose the second cy.contain block was outside of the first "then"
                // we wouldn't have access to "emailText" and "passwordText" anymore
                expect(passwordTextTwo).to.equal(passwordText);

                // As we explained in the first "then" block, the firstForm and secondForm are converted to jquery objects
                // in case we want to convert them back to cypress objects we just need to "wrap" them 
                cy.wrap(secondForm).find('[for="inputPassword2"]').should('contain', 'Password');
                
                //check difference in the console for the below two lines
                cy.log(secondForm);
                cy.log(cy.wrap(secondForm));
            })
        })
    })
})