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
// prompt the user with a set of main questions
inquirer.prompt(questions.mainQuestion).then(async (answers) => {
     //user's answer, call the appropriate staff function
    switch (answers.action) {
        case 'View All Departments':
            
            await staffFunctions.viewAllDepartments();
            break;
          case 'View All Roles':
            await staffFunctions.viewAllRoles();
            break;
          case 'View All Employees':
            await staffFunctions.viewAllEmployees();
            break;
          case 'Add Department':
            await staffFunctions.addDepartment();
            break;
          case 'Add Role':
            await staffFunctions.addRole();
            break;
          case 'Add Employee':
            await staffFunctions.addEmployee();
            break;
          case 'Update Employee Role':
            await staffFunctions.updateEmployeeRole();
            break;
          case 'Exit':
            db.end();
            console.log('Exiting...');
            process.exit();
            break;
          default:
            console.log('Invalid operation');
        }
        promptUser();  // Call promptUser again after the previous operation finishes
      });
    }
    
    promptUser();