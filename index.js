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
                    addEmployee();
                    break;

                case "View Employees":
                    viewEmployees();
                    break;

                case "Update Employee Role":
                    updateRole();
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
    var query = `SELECT role.title, role.salary, department.name AS Department
    FROM role INNER JOIN department ON (role.department_id = department.id)`;
    connection.query(query, function (err, res) {
        console.log("=======Roles=========")
        console.table(res)
        runSearch()
    });
}

function addEmployee() {
    const roleArr = []
    const employeeArr = ["None"]
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        res.forEach(index => {
            roleArr.push(index.title)
        })
        connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
            if (err) throw err;
            res.forEach(index => {
                employeeArr.push(`${index.first_name} ${index.last_name}`)
            })
            inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the Employee's First Name? "
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the Employee's Last Name? "
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is their role?",
                    choices: roleArr
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is their Manager?",
                    choices: employeeArr
                }
            ])
            .then(function (answer) {
                connection.query("SELECT id FROM role WHERE title = ?", answer.role, function (err, res) {
                    if (err) throw err;
                    var roleId = (res[0].id)
                    if  (answer.manager != "None"){
                        const manager = answer.manager.split(' ')
                        console.log(manager)
                        connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [`${manager[0]}`,`${manager[1]}`], function (err, res) {
                            if (err) throw err;
                            var managerId = (res[0].id)
                            console.log(managerId)
                            connection.query("INSERT INTO employee(first_name, last_name, role_id,manager_id) VALUES(?,?,?,?)",[`${answer.firstName}`,`${answer.lastName}`,roleId,managerId], function (err, res) {
                            })
                            runSearch();
                        })
                    }else{
                        connection.query("INSERT INTO employee(first_name, last_name, role_id) VALUES(?,?,?)",[`${answer.firstName}`,`${answer.lastName}`,roleId], function (err, res) {
                        })
                        runSearch();
                    }
                    
                })

            });
        })
    })
    
        
    
}

function viewEmployees() {
    var query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id AS Manager
    FROM employee INNER JOIN role ON (employee.role_id = role.id);`;
    connection.query(query, function (err, res) {
        console.table(res)
        runSearch()
    });
}

function updateRole(){
    const employeeArr = []
    const roleArr = []
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        res.forEach(index => {
            employeeArr.push(`${index.first_name} ${index.last_name}`)
            console.log(employeeArr)
        })
        connection.query("SELECT title FROM role", function (err, res) {
            if (err) throw err;
            res.forEach(index => {
                roleArr.push(index.title)
            })
            inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    choices: employeeArr
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is their new role?",
                    choices: roleArr
                }
            ])
            .then(function (answer) {
                connection.query("SELECT id FROM role WHERE title = ?", answer.role, function (err, res) {
                    if (err) throw err;
                    var roleId = (res[0].id)
                    const employee = answer.employee.split(' ')
                    connection.query("UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?;",[roleId, `${employee[0]}`,`${employee[1]}`], function (err, res) {
                    })
                    runSearch();
                })

            });
        })
    })
    
    
}