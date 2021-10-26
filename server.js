const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table')
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root1234',
      database: 'management_db'
    },

console.log(" ---------------------------- "),
console.log("| EMPLOYEE MANAGEMENT SYSTEM |"),
console.log(" ---------------------------- "),
    );


const addMenu = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Employees",
                "Add Employee",
                "Update Employee Role",
                "View all Roles",
                "Add Role",
                "View all Departments",
                "Add Department",
                "Remove Department",
                "Quit"              
            ]
          })
          .then((answer) => {
            switch (answer.action) {
                case 'View all Employees':
                    viewEmployees();
                break;
                case 'Add Employee':
                    addEmployee();
                break;
                case 'Update Employee Role':
                    updateEmployee();
                break;
                case 'View all Roles':
                    viewRoles();
                break;
                case 'Add Role':
                    addRole();
                break;
                case 'View all Departments':
                    viewDepartments();
                break;
                case 'Add Department':
                    addDepartment();
                break;
                case 'Remove Department':
                    removeDepartment();
                break;
                case 'Quit':
                    console.log('Finished.');
                break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                      break;
              }
          });
    };


function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
      console.log("All Employees");
      console.table(results);
        });
        addMenu();   
     };


function addEmployee() {
    db.query("SELECT id, title FROM role", (err, res) => {
      if (err) throw err;
      const role = res.map((role) => {
          return {
              name: role.title,
              value: role.id,
          };
      });
      inquirer
          .prompt([{
                  name: "first_name",
                  type: "input",
                  message: "What is their first name?",
              },
              {
                  name: "last_name",
                  type: "input",
                  message: "What is their last name?",
              },
              {
                  name: "role",
                  type: "list",
                  message: "What is their role?",
                  choices: role,
              },
              {
                  name: "manager",
                  type: "input",
                  message: "Who is their manager(id format):",
              },
          ])
          .then((answers) => {
              db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.first_name}", "${answers.last_name}", ${answers.role}, ${answers.manager})`,
                  (err, data) => {
                      if (err) throw err;
                      console.log("Employee added.");
                      addMenu();
                  }
              );
          });
     });
  };


  function updateEmployee() {
    db.query("select*,a.id as empID, concat(first_name, \" \", last_name) as concatName from employee a left join role b on a.role_id = b.id", (err, res) => {
    if (err) throw err;
    const employeeUpdate = res.map((employeeUpdate) => {
        return {
            name: employeeUpdate.concatName,
            value: employeeUpdate.empID,
        };
    });
    const roleUpdate = res.map((roleUpdate) => {
        return {
            name: roleUpdate.title,
            value: roleUpdate.id,
        };
    });
    inquirer
        .prompt([{
                name: "employee",
                type: "list",
                message: "Which employee do you want to update?",
                choices: employeeUpdate,
            },
            {
                name: "newRole",
                type: "list",
                message: "What is employee's new role?",
                choices: roleUpdate,
            },
        ])
        .then((answers) => {
            db.query(`UPDATE employee SET role_id = ${answers.newRole} where employee.id = ${answers.employee}`, (err, data) => {
                    if (err) throw err;
                    console.log("Employee's role updated.");
                    addMenu();
                }
            );
        });
    });
};

function viewRoles() {
    db.query('SELECT * FROM role', function (err, results) {
    console.log("All Roles");    
    console.table(results);
    });       
    addMenu();    
  };


function addRole() {
    db.query("SELECT id, name FROM department", (err, res) => {
      if (err) throw err;
      const dept = res.map((department) => {
          return {
              name: department.name,
              value: department.id,
          };
      });
      inquirer
          .prompt([{
                  name: "title",
                  type: "list",
                  message: "What is employee's role?",
                  choices: ['Web Developer',
                            'Accountant',
                            'Paralegal',
                            'Manager',
                            'Engineer',
                            'Sales Rep',]
              },
              {
                  name: "salary",
                  type: "input",
                  message: "What is the employees's salary?",
              },
              {
                  name: "department",
                  type: "list",
                  message: "What is the name of employee's department?",
                  choices: dept,
              },
          ])
          .then((answers) => {
              db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${answers.department})`,
                  (err, data) => {
                      if (err) throw err;
                      console.log("Employee role added.");
                      addMenu();
                  }
              );
          });
        });   
   
    };


  function viewDepartments() {
   db.query('SELECT * FROM department', function (err, results) {
   console.log("All Departments");
   console.table(results);
   });  
   addMenu(); 
 };

 function addDepartment() {
    inquirer
    .prompt([{
        name: "title",
        type: "input",
        message: "What is the new Department's name?",
    }, 
  ])
    .then((answers) => {
        // Query database
        db.query(`INSERT INTO department (name) VALUES ("${answers.title}")`, (err, data) => {
                if (err) throw err;
                console.log("New department added.");
                addMenu();
            }
        );
    });
  };
  
function removeDepartment() {
    db.query("SELECT id, name FROM department", (err, res) => {
      if (err) throw err;
      const dept = res.map((department) => {
          return {
              name: department.name,
              value: department.id,
          };
      });
      inquirer
          .prompt([{
              type: "list",
              name: "removeDepartment",
              choices: dept,
              message: "Which department to remove?",
          }, 
      ])
          .then((answers) => {
            db.query(`DELETE FROM department WHERE id = ${answers.removeDepartment}`, (err, data) => {
                      if (err) throw err;
                      console.log("Department Removed.");
                      addMenu();
                  }
              );
          });
        }); 
    };



addMenu();