const inquirer = require('inquirer');
const questions = require('../questions');

let db;

const staffFunctions = {
    // function to set the database connection
  setDb: function(database) {
    db = database;
  },

  viewAllDepartments: async function() {
    // query the database for all departments
    try {
      const departments = await db.query('SELECT * FROM department');
      console.table(departments);
    } catch (error) {
        // if there's an error, log it and exit the application
      console.error('An error occurred while retrieving departments:', error);
    }
  },

  viewAllRoles: async function() {
    try {
        // query the database for all roles
      const roles = await db.query('SELECT * FROM role');
      console.table(roles);
    } catch (error) {
      console.error('An error occurred while retrieving roles:', error);
    }
  },

  viewAllEmployees: async function() {
    try {
        // query the database for all employees
      const employees = await db.query('SELECT * FROM employee');
      console.table(employees);
    } catch (error) {
      console.error('An error occurred while retrieving employees:', error);
    }
  },

  addDepartment: async function() {
    // prompt the user for the department name
    const { department } = await inquirer.prompt(questions.departmentQuestions);
    try {
      await db.query('INSERT INTO department (name) VALUES (?)', department);
      console.log(`Added ${department} to the database`);
    } catch (error) {
      console.error(`An error occurred while adding department:`, error);
    }
  },

  addRole: async function() {
    //  query the database for all departments
    const departments = await db.query('SELECT * FROM department');
    const departmentNames = departments.map((department) => department.name);
    const { roleName, salary, departmentName } = await inquirer.prompt(questions.roleQuestions(departmentNames));
    const department = departments.find((department) => department.name === departmentName);
    try {
      await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleName, salary, department.id]);
      console.log(`Added ${roleName} to the database`);
    } catch (error) {
      console.error(`An error occurred while adding role:`, error);
    }
  },

  addEmployee: async function() {
    // query the database for all roles and employees
    const roles = await db.query('SELECT * FROM role');
    const employees = await db.query('SELECT * FROM employee');
    const roleTitles = roles.map((role) => role.title);
    const managerNames = employees.map((employee) => `${employee.first_name} ${employee.last_name}`);
    const { firstName, lastName, roleTitle, managerName } = await inquirer.prompt(questions.employeeQuestions(roleTitles, managerNames));
    const role = roles.find((role) => role.title === roleTitle);
    const manager = employees.find((employee) => `${employee.first_name} ${employee.last_name}` === managerName);
    try {
      if (manager) {
        // if the employee has a manager, add the employee to the database with a manager_id
        await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, role.id, manager.id]);
      } else {
        // if the employee doesn't have a manager, add the employee to the database with a null manager_id
        await db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [firstName, lastName, role.id]);
      }
      // log that the employee was added
      console.log(`Added ${firstName} ${lastName} to the database`);
    } catch (error) {
      console.error(`An error occurred while adding employee:`, error);
    }
  },

  updateEmployeeRole: async function() {
    // query the database for all employees and roles
    const employees = await db.query('SELECT * FROM employee');
    const roles = await db.query('SELECT * FROM role');
    const employeeNames = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
    const roleTitles = roles.map(role => role.title);

    const { employeeName, roleTitle } = await inquirer.prompt(questions.updateRoleQuestions(employeeNames, roleTitles));

    const employee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === employeeName);
    const role = roles.find(role => role.title === roleTitle);
    
    try {
        // update the employee's role in the database
      await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [role.id, employee.id]);
      console.log(`${employeeName}'s role has been updated to ${roleTitle}`);
    } catch (error) {
      console.error(`An error occurred while updating employee role:`, error);
    }
  }
}

module.exports = staffFunctions;