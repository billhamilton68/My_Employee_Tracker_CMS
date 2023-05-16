const inquirer = require('inquirer');
const express = require('express');
const questions = require('./questions');
const util = require('util');
// Import and require mysql2
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;
const app = express();

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

function promptUser() {
  inquirer.prompt(questions.mainQuestion).then((answers) => {
    switch (answers.action) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      default:
        console.log('Invalid operation');
    }
  });
}

async function viewAllDepartments() {
  try {
    const departments = await db.query('SELECT * FROM department');
    console.log('\n');
    console.table(departments);
    promptUser();
  } catch (err) {
    console.log(err);
  }
}

async function viewAllRoles() {
  try {
    const roles = await db.query('SELECT * FROM role');
    console.log('\n');
    console.table(roles);
    promptUser();
  } catch (err) {
    console.log(err);
  }
}

async function viewAllEmployees() {
  try {
    const employees = await db.query('SELECT * FROM employee');
    console.log('\n');
    console.table(employees);
    promptUser();
  } catch (err) {
    console.log(err);
  }
}

async function addDepartment() {
  try {
    inquirer.prompt(questions.departmentQuestions).then(async (answers) => {
      await db.query('INSERT INTO department (name) VALUES (?)', [answers.department]);
      console.log(`Added ${answers.department} to the database`);
      promptUser();
    });
  } catch (err) {
    console.log(err);
  }
}

async function addRole() {
    try {
      const departments = await db.query('SELECT * FROM department');
      const departmentNames = departments.map((department) => department.name);
  
      inquirer.prompt(questions.roleQuestions(departmentNames)).then(async (answers) => {
        const department = departments.find((department) => department.name === answers.departmentName);
  
        let departmentId = null;
        if (department) {
          departmentId = department.id;
        }
  
        await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.roleName, answers.salary, departmentId]);
        console.log(`Added ${answers.roleName} to the database`);
        promptUser();
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function addEmployee() {
    try {
      const roles = await db.query('SELECT * FROM role');
      const employees = await db.query('SELECT * FROM employee');
      const roleTitles = roles.map((role) => role.title);
      const managerNames = employees.map((employee) => `${employee.first_name} ${employee.last_name}`);
  
      inquirer.prompt(questions.employeeQuestions(roleTitles, managerNames)).then(async (answers) => {
        const role = roles.find((role) => role.title === answers.roleTitle);
        const manager = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.managerName);
  
        let roleId = null;
        let managerId = null;
        if (role) {
          roleId = role.id;
        }
        if (manager) {
          managerId = manager.id;
        }
  
        await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, roleId, managerId]);
        console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
        promptUser();
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function updateEmployeeRole() {
    try {
      const employees = await db.query('SELECT * FROM employee');
      const roles = await db.query('SELECT * FROM role');
      const employeeNames = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
      const roleTitles = roles.map(role => role.title);
  
      inquirer.prompt(questions.updateRoleQuestions(employeeNames, roleTitles))
        .then(async (answers) => {
          const employee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employeeName);
          const role = roles.find(role => role.title === answers.roleTitle);
  
          let employeeId = null;
          let roleId = null;
          if (employee) {
            employeeId = employee.id;
          }
          if (role) {
            roleId = role.id;
          }
  
          if (employeeId && roleId) {
            await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
            console.log(`${answers.employeeName}'s role has been updated to ${answers.roleTitle}`);
          } else {
            console.log('Invalid employee or role. Please try again.');
          }
  
          promptUser();
        });
    } catch (err) {
      console.log(err);
    }
  }

promptUser();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  