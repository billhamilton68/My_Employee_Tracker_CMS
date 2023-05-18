const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');
const staffFunctions = require('./lib/staff');
const questions = require('./questions');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'abc_company_db'
  },
  console.log(`Connected to the abc_company_db database.`)
);

db.query = util.promisify(db.query);
staffFunctions.setDb(db);

function promptUser() {
  inquirer.prompt(questions.mainQuestion).then((answers) => {
    switch (answers.action) {
      case 'View All Departments':
        staffFunctions.viewAllDepartments(promptUser);
        break;
      case 'View All Roles':
        staffFunctions.viewAllRoles(promptUser);
        break;
      case 'View All Employees':
        staffFunctions.viewAllEmployees(promptUser);
        break;
      case 'Add Department':
        staffFunctions.addDepartment(promptUser);
        break;
      case 'Add Role':
        staffFunctions.addRole(promptUser);
        break;
      case 'Add Employee':
        staffFunctions.addEmployee(promptUser);
        break;
      case 'Update Employee Role':
        staffFunctions.updateEmployeeRole(promptUser);
        break;
      default:
        console.log('Invalid operation');
    }
  });
}

promptUser();