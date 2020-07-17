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
                    addDepartment();
                    break;

                case "View Departments":
                    viewDepartments();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "View Roles":
                    viewRoles();
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

function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "New Department Name: "
        })
        .then(function (answer) {
            var query = `INSERT INTO department(name) VALUES(?)`;
            connection.query(query, `${answer.department}`, function (err, res) {
                runSearch();
            });
        });
}

function viewDepartments() {
    var query = `SELECT * FROM department`;
    connection.query(query, function (err, res) {
        console.log("=======DEPARTMENTS=========")
        console.table(res)
        runSearch()
    });
}

function addRole() {
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        const deptArr = []
        res.forEach(index => {
            deptArr.push(index.name)
        })
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "Add a role: "
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for this role?"
                },
                {
                    name: "department",
                    type: "list",
                    message: "Which Department?",
                    choices: deptArr
                }
            ])
            .then(function (answer) {
                connection.query("SELECT id FROM department WHERE name = ?", answer.department, function (err, res) {
                    if (err) throw err;
                    var deptId = res[0].id
                    var query = `INSERT INTO role(title,salary,department_id) VALUES(?,?,?)`;
                    connection.query(query, [`${answer.title}`, answer.salary, deptId], function (err, res) {
                        runSearch();
                    });
                })

            });
    })
}

function viewRoles() {
    var query = `SELECT * FROM role`;
    connection.query(query, function (err, res) {
        console.log("=======Roles=========")
        console.table(res)
        runSearch()
    });
}

