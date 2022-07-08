const { exit } = require("process");

describe("First test suite", () => {
  it("my first test", () => {
    cy.visit("/");
    cy.contains("ngx");
  });

  it("my second test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();
  });

  it("using parent and child to find specific selectors", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();
    // using get on a selector and then using .parents to navigate to a parent element in the DOM tree
    cy.get("#inputEmail3")
      .parents("form")
      .find("button") // find can only by used within parents to search for an element within the parent tree
      .should("contain", "Sign in")
      .parents("form") // once again navigating to parent to find the checkbox under the parent of inputEmail3
      .find("nb-checkbox")
      .click();

    // can also use contains to target an element with text and then use find the type="email" within 'nb-card'
    cy.contains("nb-card", "Horizontal form").find('[type="email"]');
  });
});

describe("Saving subject of the command", () => {
  it("then and wrap methods", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

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
    cy.contains("nb-card", "Basic form").then((firstForm) => {
      // when using "then" then parameter to the "then" function becomes a jquery objects
      // in this case "firstForm" is the jquery object
      // Also another important thing to note below is the "find" will now be working on a jquery object as opposed to earlier
      // where it was being chained off of a cypress object
      // when being changed off of a jquery element we can only use jquery methods instead of cypress methods as above
      const emailText = firstForm.find('[for="exampleInputEmail1"]').text();
      const passwordText = firstForm
        .find('[for="exampleInputPassword1"]')
        .text();
      expect(emailText).to.eq("Email address");
      expect(passwordText).to.eq("Password");

      cy.contains("nb-card", "Using the Grid").then((secondForm) => {
        const passwordTextTwo = secondForm
          .find('[for="inputPassword2"]')
          .text();
        //since this cy.contains block is within the first "then" block we still have access to the variables defined
        // outside of the second "then" block. If suppose the second cy.contain block was outside of the first "then"
        // we wouldn't have access to "emailText" and "passwordText" anymore
        expect(passwordTextTwo).to.equal(passwordText);

        // As we explained in the first "then" block, the firstForm and secondForm are converted to jquery objects
        // in case we want to convert them back to cypress objects we just need to "wrap" them
        cy.wrap(secondForm)
          .find('[for="inputPassword2"]')
          .should("contain", "Password");

        //check difference in the console for the below two lines
        cy.log(secondForm);
        cy.log(cy.wrap(secondForm));
      });
    });
  });
});

describe("Invoke Command", () => {
  it("using the invoke command (attributes)", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // we can obtain the text using three methods
    // and two of these we saw in the previous tests as below
    // 1. cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')
    // 2.
    // cy.get('[for="exampleInputEmail1"]').then( label => {
    //     expect(label.text()).to.equal('Email address')
    // })

    // and the 3. is using the invoke command
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((txt) => {
        expect(txt).to.equal("Email address");
      });

    // using invoke to invoke the attribute class to show the class list of the element selected
    // cy.contains("nb-card", "Basic form")
    //   .find("nb-checkbox")
    //   .find(".custom-checkbox")
    //   .click()
    //   .invoke("attr", "class")
    //   .should("contain", "checked");

    // alternate method to invoke the attribute class to show the class list of the element selected
    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .find(".custom-checkbox")
      .click()
      .invoke("attr", "class")
      .then((classValue) => {
        expect(classValue).to.contain("checked");
      });
  });

  it("using invoke on a datepicker property", () => {
    // in this case we need to use the property of the html element, as the selected date is not available in the DOM
    // the selected date in the input is saved in the "value" property of the input html element
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((inputEl) => {
        // wrapping the jquery element to make is cypress chainable
        cy.wrap(inputEl).click();
        cy.get("nb-calendar-picker").contains("1").click();

        cy.wrap(inputEl)
          .invoke("prop", "value")
          .should("contain", "Jul 1, 2022");
      });
  });
});

describe("checkboxes and radio buttons", () => {
    it('radio button', () => {
        cy.visit("/");
        cy.contains("Forms").click();
        cy.contains("Form Layouts").click();

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( radioButtons => {
            cy.wrap(radioButtons)
                .first()
                .check({force: true})
                .should('be.checked')

            cy.wrap(radioButtons)
                .eq(1)
                .check({force: true})
                .should('be.checked')
            
            cy.wrap(radioButtons)
                .eq(0)
                .should('not.be.checked')

            cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')
        })
    })

    it('checkboxes', () => {
        cy.visit("/");
        cy.contains("Modal & Overlays").click();
        cy.contains("Toastr").click();

        // cy.get('[type="checkbox"]').check({ force: true })
        // the above line will make sure to match all the checkboxes on the page, and it checks only those that were unchecked. 
        // Suppose we had three checkboxes, out of which two were already checked, the above command will only check the one checkbox
        // that was unchecked. To uncheck checkboxes we need to use the click command instead of the check. 
        
        // when using click it will only click on one checkbox at a time instead of like the check where it looped over all of the checkboxes.
        // so this will not work
        // cy.get('[type="checkbox"]').click({ force: true })

        // whereas the below will work -  this will check the unchecked checkbox
        cy.get('[type="checkbox"]').eq(1).click({ force: true })

        // and the below will uncheck a checked checkbox
        cy.get('[type="checkbox"]').eq(0).click({ force: true })

        // in short check will only work with input buttons that are of type "radio" or "checkbox". It will not work on any other element.
        // check method can only check your checkboxes and cannot uncheck. It can also be applied to multiple checkboxes
    })
})

describe("Lists and dropdowns", () => {
    it("list and dropdown", () => {
        cy.visit("/")

        // 1.
        // manually check validation for each case when there is only one
        // cy.get('nav nb-select').click()
        // cy.get('.options-list').contains('Dark').click()
        // cy.get('nav nb-select').should('contain', 'Dark')
        // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

        // 2.
        // when there are more than one option to check it is better to loop over the items
        cy.get('nav nb-select').then( dropdown => {
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option').each( (listItem, index) => {
                const itemText = listItem.text().trim()

                const colors= {
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)",
                }

                cy.wrap(listItem).click()
                cy.get('nav nb-select').should('contain', itemText)
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])

                if(index < 3) {
                    cy.wrap(dropdown).click()
                }
            })
        })

        // 3. the third method is by using "cy select", https://docs.cypress.io/api/commands/select
        // this can only be used when there is "select" element in the DOM 
        // in this example the element is named "nb-select" instead of "select" and hence we cannot use this 

    })
})

describe.only('Web Tables', () => {
    it('verify the value entered in a table column is correct', () => {
        cy.visit("/");
        cy.contains("Tables & Data").click();
        cy.contains("Smart Table").click();

        // 1
        // target the main table body and select the column that we want to work with
        // once we know the column, we save the context of the table column and then work with it
        cy.get('tbody').contains('tr', 'John').then( tableColumn => {
            cy.wrap(tableColumn).find('.nb-edit').click()
            cy.wrap(tableColumn).find('[placeholder="Age"]').clear().type('30')
            cy.wrap(tableColumn).find('.nb-checkmark').click()
            // we don't have a unique class or attribute for the various columns within a row
            // instead since the columns are consistent we use the index/order of the columns and then verify the text value 
            cy.wrap(tableColumn).find('td').eq(6).should('have.text', '30')
        })
    })

    it.only('verify the search returns the correct results', () => {
        const ages = ['15', '20', '30'];
        cy.visit("/");
        cy.contains("Tables & Data").click();
        cy.contains("Smart Table").click();


        // to check single age
        // cy.get('thead [placeholder="Age"]').clear().type(20);
        // cy.get('tbody tr').each( tableRows => {
        //     if(tableRows.length != 0){
        //         cy.wrap(tableRows).find('td').eq(6).should('have.text', 20)
        //     }
        // })
        
        // looping through an array of age
        cy.wrap(ages).each( age => {
            cy.get('thead [placeholder="Age"]').clear().type(age);
            cy.wait(500);

            cy.get('tbody tr').each( tableRow => {
                cy.wrap(tableRow).find('td').eq(6).should('have.text', age)
            })
        })
    })
})