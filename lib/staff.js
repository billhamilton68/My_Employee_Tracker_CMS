const inquirer = require('inquirer');
const questions = require('../questions');
const util = require('util');

let db;

const staffFunctions = {
  setDb: function(database) {
    db = database;
  },

  promptUser: function() {
    inquirer.prompt(questions.mainQuestion).then((answers) => {
      switch (answers.action) {
        case 'View All Departments':
          this.viewAllDepartments();
          break;
        case 'View All Roles':
          this.viewAllRoles();
          break;
        case 'View All Employees':
          this.viewAllEmployees();
          break;
        case 'Add Department':
          this.addDepartment();
          break;
        case 'Add Role':
          this.addRole();
          break;
        case 'Add Employee':
          this.addEmployee();
          break;
        case 'Update Employee Role':
          this.updateEmployeeRole();
          break;
        default:
          console.log('Invalid operation');
      }
    });
  },

  viewAllDepartments: async function() {
    const departments = await db.query('SELECT * FROM department');
    console.table(departments);
    this.promptUser();
  },

  viewAllRoles: async function() {
    const roles = await db.query('SELECT * FROM role');
    console.table(roles);
    this.promptUser();
  },

  viewAllEmployees: async function() {
    const employees = await db.query('SELECT * FROM employee');
    console.table(employees);
    this.promptUser();
  },

  addDepartment: function() {
    inquirer.prompt(questions.departmentQuestions).then(async (answers) => {
      await db.query('INSERT INTO department (name) VALUES (?)', [answers.department]);
      console.log(`Added ${answers.department} to the database`);
      this.promptUser();
    });
  },

  addRole: async function() {
    const departments = await db.query('SELECT * FROM department');
    const departmentNames = departments.map((department) => department.name);

    inquirer.prompt(questions.roleQuestions(departmentNames)).then(async (answers) => {
      const department = departments.find((department) => department.name === answers.departmentName);
      await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.roleTitle, answers.salary, department.id]);
      console.log(`Added ${answers.roleTitle} to the database`);
      this.promptUser();
    });
  },

  addEmployee: async function() {
    const roles = await db.query('SELECT * FROM role');
    const employees = await db.query('SELECT * FROM employee');
    const roleTitles = roles.map((role) => role.title);
    const managerNames = employees.map((employee) => `${employee.first_name} ${employee.last_name}`);

    inquirer.prompt(questions.employeeQuestions(roleTitles, managerNames)).then(async (answers) => {
      const role = roles.find((role) => role.title === answers.roleTitle);
      const manager = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === answers.managerName);

      if (manager) {
        await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, role.id, manager.id]);
      } else {
        await db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [answers.firstName, answers.lastName, role.id]);
      }
      
      console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
      this.promptUser();
    });
  },

  updateEmployeeRole: async function() {
    const employees = await db.query('SELECT * FROM employee');
    const roles = await db.query('SELECT * FROM role');
    const employeeNames = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
    const roleTitles = roles.map(role => role.title);

    inquirer.prompt(questions.updateRoleQuestions(employeeNames, roleTitles))
      .then(async (answers) => {
        const employee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employeeName);
        const role = roles.find(role => role.title === answers.roleTitle);
        await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [role.id, employee.id]);
        console.log(`${answers.employeeName}'s role has been updated to ${answers.roleTitle}`);
        this.promptUser();
      });
  }
}

module.exports = staffFunctions;