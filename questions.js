const inquirer = require('inquirer');


const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Add Department', 'Add Employee', 'Update Employee Role'],
    },
    {
      type: 'list',
      name: 'department',
      message: 'What is the name of the Department?:',
      choices: ['Service', 'Sales', 'Support', 'Marketing', 'Human Resources'],
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the name of the role?:',
      choices: ['Manager', 'Director', 'Agent', 'Supervisor', 'Engineer'],
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?:',
    },
    {
      type: 'list',
      name: 'roleOwner',
      message: 'Which department does the role belong to?:',
      choices: ['Service', 'Sales', 'Support', 'Marketing', 'Human Resources'],
    },
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employees first name?:',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employees last name?:',
    },
    {
      type: 'list',
      name: 'employeeRole',
      message: 'What is the employees role?',
      choices: ['Manager', 'Director', 'Agent', 'Supervisor', 'Engineer'],
    },
    {
      type: 'list',
      name: 'email',
      message: 'Who is the employees manager?',
    },

    {
      type: 'list',
      name: 'email',
      message: 'Which employees role would you like to update?',
    },
  ];