var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "View Departments",
                "Add Role",
                "View Roles",
                "Add Employee",
                "View Employees",
                "Update Employee Role"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add Department":
                    console.log("Branch Not Complete");
                    break;

                case "View Departments":
                    console.log("Branch Not Complete");
                    break;

                case "Add Role":
                    console.log("Branch Not Complete");
                    break;

                case "View Roles":
                    console.log("Branch Not Complete");
                    break;

                case "Add Employee":
                    console.log("Branch Not Complete");
                    break;

                case "View Employees":
                    console.log("Branch Not Complete");
                    break;

                case "Update Employee Role":
                    console.log("Branch Not Complete");
                    break;
            }
        });
}
