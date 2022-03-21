const logIn = () => {
  const { username, password } = Cypress.env("credentials");

  // Capture HTTP requests.
  cy.intercept("POST", "log_in").as("logIn");

  // Log into the app.
  cy.visit("/#/log-in");
  cy.get("input#username").type(username);
  cy.get("input#password").type(password, { log: false });
  cy.get("button").contains("Log in").click();
  cy.wait("@logIn");
};

describe("Authentication", function () {
  it("Can log in.", function () {
    logIn();

    cy.hash().should("eq", "#/dashboard");
    cy.get("a").contains("Log out");
  });

  it("Can sign up.", function () {
    cy.intercept("POST", "sign_up", {
      statusCode: 201,
      body: {
        id: 1,
        username: "maty@example.com",
        first_name: "Maty",
        last_name: "Mty",
      },
    }).as("signUp");

    cy.visit("/#/sign-up");
    cy.get("input#username").type("maty@example.com");
    cy.get("input#firstName").type("Maty");
    cy.get("input#lastName").type("Mty");
    cy.get("input#password").type("pAssw0rd", { log: false });

    cy.get("button").contains("Sign up").click();
    cy.wait("@signUp");
    cy.hash().should("eq", "#/log-in");
  });

  it("Cannot visit the login page when logged in.", function () {
    logIn();
    cy.visit("/#/log-in");
    cy.hash().should("eq", "#/");
  });

  it("Cannot visit the sign up page when logged in.", function () {
    logIn();

    cy.visit("/#/sign-up");
    cy.hash().should("eq", "#/");
  });

  it("Shows an alert on login error.", function () {
    const { username, password } = Cypress.env("credentials");
    cy.intercept("POST", "log_in", {
      statusCode: 400,
      body: {
        __all__: [
          "Please enter a correct username and password. " +
            "Note that both fields may be case-sensitive.",
        ],
      },
    }).as("logIn");
    cy.visit("/#/log-in");
    cy.get("input#username").type(username);
    cy.get("input#password").type(password, { log: false });
    cy.get("button").contains("Log in").click();
    cy.wait("@logIn");
    cy.get("div.alert").contains(
      "Please enter a correct username and password. " +
        "Note that both fields may be case-sensitive."
    );
    cy.hash().should("eq", "#/log-in");
  });

  it("Can log out.", function () {
    logIn();
    cy.get("a")
      .contains("Log out")
      .click()
      .should(() => {
        expect(window.localStorage.getItem("tennis.auth")).to.be.null;
      });
    cy.get("button").contains("Log out").should("not.exist");
  });

  it("Show invalid fields on sign up error.", function () {
    cy.intercept("POST", "sign_up", {
      statusCode: 400,
      body: {
        username: ["A user with that username already exists."],
      },
    }).as("signUp");
    cy.visit("/#/sign-up");
    cy.get("input#username").type("maty@example.com");
    cy.get("input#firstName").type("Maty");
    cy.get("input#lastName").type("Mty");
    cy.get("input#password").type("pAssw0rd", { log: false });

    cy.get("button").contains("Sign up").click();
    cy.wait("@signUp");
    cy.get("div.invalid-feedback").contains(
      "A user with that username already exists"
    );
    cy.hash().should("eq", "#/sign-up");
  });
});
