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

describe('Web Tables', () => {
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

    it('verify the search returns the correct results', () => {
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

describe('Web Datepickers', () => {
    // existing test that we used in the invoke section
    // it("using invoke on a datepicker property", () => {
    //     // in this case we need to use the property of the html element, as the selected date is not available in the DOM
    //     // the selected date in the input is saved in the "value" property of the input html element
    //     cy.visit("/");
    //     cy.contains("Forms").click();
    //     cy.contains("Datepicker").click();
    
    //     cy.contains("nb-card", "Common Datepicker")
    //       .find("input")
    //       .then((inputEl) => {
    //         // wrapping the jquery element to make is cypress chainable
    //         cy.wrap(inputEl).click();
    //         cy.get("nb-calendar-picker").contains("1").click();
    
    //         cy.wrap(inputEl)
    //           .invoke("prop", "value")
    //           .should("contain", "Jul 1, 2022");
    //       });
    //   });

    // the above test has a drawback of using static test data and hence will fail when we run the test during another time frame
    // below we will dynamically select the date based on the current date
    it("use the current date to assert dynamic date selection", () => {

        //creating a function so that this can be called again and again in case we need to navigate to different months
        function selectDate(daysAhead) {
            let date = new Date(); //  Mon Jul 11 2022 12:37:43 GMT+0200 (Central European Summer Time)
            date.setDate(date.getDate() + daysAhead) // Wed Jul 13 2022 12:37:43 GMT+0200 (Central European Summer Time)
            cy.log(`Future date is : ${date}`); 
            let futureDate = date.getDate() // 13
            let futureMonth = date.getMonth() // 6 ( Jan - Dec : 0 - 11)
            futureMonth = date.toLocaleString('default', { month: 'short' }) // Jul  
            // check more options here: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
            let assertDate = `${futureMonth} ${futureDate}, ${date.getFullYear()}`;

            cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then( dateInPicker => {
                cy.log(`Date in picker: ${dateInPicker}`)
                if(!dateInPicker.includes(futureMonth)){
                    cy.get('[ng-reflect-icon="chevron-right-outline"]').click()
                    selectDate(daysAhead)
                    // we are calling this function recursivley because we want to repeat the step of navigating to the next months
                    // till the if condition is met
                } else {
                    // adding "nb-calendar-day-cell[class="day-cell ng-star-inserted"]" ensures only the active dates are selected
                    cy.get(`nb-calendar-day-picker nb-calendar-day-cell[class="day-cell ng-star-inserted"]`).contains(futureDate).click();
                }
            })
            // we are returning the assert date from the function so that we can use the value later on to assert the condition
            return assertDate;
        }

        cy.visit("/");
        cy.contains("Forms").click();
        cy.contains("Datepicker").click();

        cy.contains("nb-card", "Common Datepicker")
          .find("input")
          .then((inputEl) => {
            cy.wrap(inputEl).click();
            // calling the function and giving it a parameter for the number of days to advance
            let assertDate = selectDate(195);
    
            cy.wrap(inputEl)
              .invoke("prop", "value")
              .should("contain", assertDate);
          });
      });
})

describe('Pop-ups and tooltips', () => {
    it('verify the tooltip text', () => {
        cy.visit('/');
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()
    
        cy.contains('nb-card', 'Colored Tooltips').find('button').eq(0).then(button => {
            cy.wrap(button).should('have.text', 'Default');
            // triggering an event listenter like the mouseenter/mouseover etc
            // this will work only if the application was programmed to trigger such events
            cy.wrap(button).trigger('mouseenter').then(() => {
                cy.get('nb-tooltip').should('contain', 'This is a tooltip')
            })
        })
    })

    it.only('dialog boxes', () => {
        cy.visit('/');
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        // normal dialog boxes are easy to work with as they are like working with any other elements
        // wait for them to appear and then assert the selector and text within them
        // however certain dialog boxes like the browser alert dialog boxes are harder to work with as we need to have access to the browser window object
        // cy.get('nb-card-body tbody').find('tr').eq(0).find('.nb-trash').click()

        // in the above line we can find cypress automatically confirms the option on the alert box without asking for an input. 
        // This is because cypress is configured to automatically confirm the action on these dialog boxes

        // 1
        // To get around this and make sure we can assert the text in the alert dialog box 
        // can either use window:confirm or window:alert here for the on event
        // cy.on('window:confirm', (confirm) => {
        // // the code in this block will only execute if the "window:confirm" event was triggered, but if not this will never run
        //     expect(confirm).to.equal('Are you sure you want to delete?')
        // })

        // 2
        // const stub = cy.stub();
        // cy.on('window:confirm', stub)
        // cy.get('nb-card-body tbody').find('tr').eq(0).find('.nb-trash').click().then(() => {
        //     expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        // })
        // the adv of using the 2 approach is that in case the window:confirm event is not triggered, the stub will be set to an empty object 
        // so when making the getCall on the stub we will not have any message

        // 3
        // In case we want to cancel the action on such alert dialog boxes we need to use a work around
        // this will ensure that cypress automatically selects the false option (cancel)
        cy.get('nb-card-body tbody').find('tr').eq(0).find('.nb-trash').click()
        cy.on('window:confirm', () => false)

    })

})

describe.only('Cypress Assertions', () => {
    // Cypress assertions - https://docs.cypress.io/guides/references/assertions
    // 3 main types

    // 1. BDD Assertions - https://docs.cypress.io/guides/references/assertions#BDD-Assertions
    // These are used for expect/should general cases, like asserting a name to equal something, or expecting an object to contain 
    // a property etc. 
        // expect(name).to.not.equal('Jane')    
        // expect(arr).to.have.any.keys('age')
        // expect('test').to.have.ownProperty('length')
        
        // some of the chainable getters are as follows:
        // to, be, been, is, that, which, and, has, have, with, at, of, same

    // 2. TDD Assertions - https://docs.cypress.io/guides/references/assertions#TDD-Assertions
    //  these start with keyword assert. We can instead use chai and BDD to get around most use cases
        // assert.isOk('everything', 'everything is ok')
        // assert.notDeepEqual({ id: '1' }, { id: '2' })

    // 3. Chai Jquery - https://docs.cypress.io/guides/references/assertions#Chai-jQuery
    // these are mainly used to assert something about a DOM object. These are mainly used along with cy.get() and cy.contains()
    // here the expect takes an element as a parameter
        // expect($el).to.have.attr('foo', 'bar')
        // expect($el).to.have.class('foo')
        // expect($el).to.be.visible

    // when using a "".should" chainer, we normally use the chai jquery syntax like should('have.class', 'foo')
    // we can also chain two should chainers on any elements
    //  e.g: 
        // cy.get('[selector]')
        //  .should('contain', 'Email address')
        //  .should('have.class', 'foo')
        //  .and('have.text', 'Exact text')

    // 
        // cy.wrap(inputEl)
        // .invoke("prop", "value")
        // .should("contain", assertDate);

    // the above can also be reduced 
        //  cy.wrap(inputEl)
        // .should("have.value", assertDate);
});
});

    // 4. Sinon-Chai
    // These are mainly used with cy.stub() and cy.spy(), more widely used for unit testing

})